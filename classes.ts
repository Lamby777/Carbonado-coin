// Code writeup module for use in index.js
"use strict";

import {blockchain}	from "./index";
import * as crypto	from "crypto";
import {ec as EC}	from "elliptic";
const ec = new EC("secp256k1");

const keypair = "test";

// Amazing how you can write "type Script" in TypeScript
export interface Script {
	code:		string,
	sigs:		Record<string, string>,
	author?:	string,
}

export class Declaration {
	constructor() {}
}

export class TokenDeclaration {
	constructor() {}
}

export type BlockBody = {
	transactions?:	Transaction[];
	declarations?:	Declaration[];
	actions?:		Script[];
}

export class Transaction {
	constructor(public inputs: TxI[], public outputs: TxO[]) {}

	get id(): string {
		let inputData = this.inputs
			.map((txI) => txI.fromNum + txI.fromId + txI.amount)
			.reduce((a, b) => a + b, "");

		let outputData = this.outputs
			.map((txO) => txO.num + txO.addr + txO.amount)
			.reduce((a, b) => a + b, "");
		
		return Transaction.hash(inputData, outputData);
	}

	static queryTx(filter?: (tx: Transaction) => boolean):
			Transaction[] {
		
		let arr: Transaction[] = [];
		
		blockchain.forEach((block) => {
			if (!block.body?.transactions) return;
			
			block.body.transactions.forEach((tx) => {
				if (!filter || filter(tx)) arr.push(tx);
			});
		});
		
		return arr;
	}

	static queryOut(filter?: (txo: TxO) => boolean):
			TxO[] {
		
		let arr: TxO[] = [];
		
		blockchain.forEach((block) => {
			if (!block.body?.transactions) return;
			
			block.body.transactions.forEach((tx) => {
				tx.outputs.forEach((out) => {
					if (!filter || filter(out)) arr.push(out);
				});
			});
		});
		
		return arr;
	}

	static queryIn(filter?: (txi: TxI) => boolean):
			TxI[] {
		
		let arr: TxI[] = [];
		
		blockchain.forEach((block) => {
			if (!block.body?.transactions) return;
			
			block.body.transactions.forEach((tx) => {
				tx.inputs.forEach((input) => {
					if (!filter || filter(input)) arr.push(input);
				});
			});
		});
		
		return arr;
	}

	// Does the same thing as hash()
	// Only added this for code maintainability
	static hash(inputs: string, outputs: string): string {
		return hash(inputs + outputs);
	}
}

export function hash(input: any, format?: string): string {
	return crypto.createHash("sha256")
		.update(input).digest(<any>(format ? format : "hex"));
}

export class Block {
	public localeCVal:	number | null; // Hey, that rhymes!
	public nonces:		number[];
	public solvedBy:	string[];

	constructor(
		public num?:		number,
		public previous?:	string,
		public body?:		BlockBody | null, // fix later
		public timestamp?:	number,
		public hash?:		string) {

		this.num = num ?? blockchain.length,
		this.previous = previous, // Previous hash
		this.body = body !== undefined ? body : null,
		this.timestamp = timestamp || Date.now(),
		this.localeCVal = null, // Difficulty at mine-time
		this.nonces = [],
		this.solvedBy = [],
		this.hash = hash ?? Block.hash(this);
	}

	// Get hash of a block
	static hash(
		block:		Block,
		nonce?:		number,
		format?:	string): string {
		// For mining
		let trueNonce = nonce ? nonce : block.nonces[0];
		let input = block.num + block.previous +
				block.body + block.timestamp;
		if (trueNonce) input += trueNonce;
		return hash(input, format);
	}

	/*	Create a block
	* Unlike using "new Block()," this method gets the block
	* prepared and pushed into the blockchain. Don't use this
	* for temporary "throwaway" blocks, since they'll be permanent!
	*/
	static generate(body:	BlockBody,
					chain:	(() => Block[]) | null
						= () => blockchain): Block {
		let prevBlock, previous, num;
		if (blockchain.length === 0) {
			// If genesis block
			prevBlock = null;
			previous = "";
			num = 0;
		} else {
			// If... not genesis block?
			prevBlock = blockchain[blockchain.length-1];
			previous = prevBlock.hash;
			num = prevBlock.num + 1;
		}

		// Prevent empty blocks
		if (!body) {
			console.log("Attempt to create empty block " + num);
			return null;
		}

		let block = new Block(num, previous, body);
		if (chain && chain()) chain().push(block);
		return block;
	}


	static verify(block: Block): boolean {
		// Get actual previous block from current block's index
		let prevBlock = blockchain.filter(val => val.num === block.num-1)[0];

		// If any of these booleans is "true," we got a problem.
		const failCases = [
			// Block hash doesn't match own recorded hash
			Block.hash(block) !== block.hash,
			
			// Block was sent by a time-traveler... or a hacker.
			block.timestamp > Date.now(),

			// THE FOLLOWING CHECKSUMS DON'T APPLY TO GENESIS
			block.num !== 0 && (
				// Previous block does not exist
				!prevBlock ||

				// Block's recorded prevhash doesn't match previous's hash
				prevBlock.hash !== block.previous
			)
		]
		
		// Check for tampering
		return !(failCases.includes(true));
	}
}

export class TxI {
	public sig: string = "";

	constructor(
		public fromNum?: number,
		public fromId?: string,
		public amount?: number) {
		// set signature later
		//this.sig = "";
	}

	static sign(
		transaction: Transaction,
		txI: TxI,
		privKey: string): number[] {
		//UTXOs: TxO[] ) {
		
		/*if (txI instanceof Number) {
			txI = transaction.inputs[txI];
		}*/

		const sigData = transaction.id; // apparently () big bad
		const referencedUTXO = TxO.getUOutAtIndex(
			/*txI.fromId,*/ txI.fromNum);
		//const referencedAddress = referencedUTXO.address;
		const key = ec.keyFromPrivate(privKey, "hex");
		return key.sign(sigData).toDER();
	}
}

export class TxO {
	public num: number;

	constructor(
		public addr: string,
		public amount: number,
		public spent: boolean) {
		this.num = Transaction.queryTx().length;
	}

	// Query TXO list for unspent with matching num
	static getUOutAtIndex(num: number) {
		return Transaction.queryOut(val =>
			(val.num === num) && (!val.spent));
	}
}
