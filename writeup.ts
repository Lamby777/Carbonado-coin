// Code writeup module for use in index.js
"use strict";

import * as crypto	from "crypto";
import {ec as EC}	from "elliptic";
//const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const keypair = "test";

// fix any[] to class later
function exp(blockchain: any[]): Object {
	class Block {
		public num: number;
		public previous: string;
		public body: any;
		public timestamp: number;
		public difficultyLocale: any; ////////// fix
		public nonces: any[];
		public hash: string;

		constructor(
			num?: number,
			previous?: string,
			body?: any, // fix later
			timestamp?: number) {
			
			this.num = num ? num : blockchain.length,
			this.previous = previous, // Previous hash
			this.body = body !== undefined ? body : null,
			this.timestamp = timestamp || new Date().getTime(),
			this.difficultyLocale = null, // Difficulty at the time of verification
			this.nonces = [],
			this.hash = Block.hash(this);
		}

		static hash(
			block: Block,
			nonce?: number,
			format?: string): string {
			// For mining
			let trueNonce = nonce ? nonce : block.nonces[0];
			let input = block.num + block.previous +
					block.body + block.timestamp;
			if (trueNonce) input += trueNonce;
			return hash(input, format);
		}

		static generate(body: Object,
						chain: (() => Block[]) | null
							= () => blockchain): Block {
			let prevBlock, previous, num;
			if (blockchain.length === 0) {
				prevBlock = null;
				previous = "";
				num = 0;
			} else {
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
			if (chain()) chain().push(block);
			return block;
		}


		static verify(block: Block): boolean {
			// Innocent until proven guilty :)
			let valid = true;
			let prevBlock = blockchain.filter(val => val.num === block.num-1)[0];

			if ((block.num !== 0 && // First 2 checks don't apply to genesis
				(!prevBlock || // Block doesn't exist
				(prevBlock.hash !== block.previous))) // Block P-hash fail
				
				|| // Genesis checks this part
				(Block.hash(block) !== block.hash)) { // Block was tampered
				valid = false;
			}
			return valid;
		}
	}



	class Transaction {
		public inputs: TxI[];
		public outputs: TxO[];

		constructor(inputs: TxI[], outputs: TxO[]) {
			this.inputs = inputs,
			this.outputs = outputs;
		}

		get id(): string {
			let inputData = this.inputs
				.map((txI) => txI.fromNum + txI.fromId + txI.amount)
				.reduce((a, b) => a + b, "");

			let outputData = this.outputs
				.map((txO) => txO.num + txO.addr + txO.amount)
				.reduce((a, b) => a + b, "");
			
			return Transaction.hash(inputData, outputData);
		}

		// Does the same thing as hash()
		// Only added this for code maintainability
		static hash(inputs: string, outputs: string): string {
			return hash(inputs + outputs);
		}
	}

	class TxI {
		public fromNum: number;
		public fromId: string;
		public amount: number;
		public sig: string;

		constructor(
			fromNum?: number,
			fromId?: string,
			amount?: number) {
			this.fromNum = fromNum,
			this.fromId = fromId,
			this.amount = amount,
			this.sig = "";
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
			const referencedUTXO = TxO.getUnspentByNum(
				/*txI.fromId,*/ txI.fromNum);
			//const referencedAddress = referencedUTXO.address;
			const key = ec.keyFromPrivate(privKey, "hex");
			return key.sign(sigData).toDER();
		}
	}

	class TxO {
		// List of all TXOs, including spent
		public static list: TxO[] = [];
		public num: number;
		public addr: string;
		public amount: number;
		public spent: boolean;

		constructor(
			addr: string,
			amount: number,
			spent: boolean) {
			this.num = TxO.list.length,
			this.addr = addr,
			this.amount = amount;
			this.spent = spent;

			// Push to UTXOs list if not spent
			TxO.list.push(this);
		}

		// Query TXO list for unspent with matching num
		static getUnspentByNum(num: number) {
			return TxO.list.find(val =>
				(val.num === num) && (!val.spent));
		}

		static get unspent() {
			return TxO.list.filter((val: any) => !val.spent);
		}

		static updateUnspent() {
			// Check blockchain for new in/outs and
			// update spent status of old UTXOs
		}
	}

	function hash(input: any, format?: string): string {
		return crypto.createHash("sha256")
			.update(input).digest(<any>(format ? format : "hex"));
	}

	return {
		Block: Block,
		Transaction: Transaction,
		TxI: TxI,
		TxO: TxO,
		hash: hash,
	}
}

export = exp;
//module.exports = exp;
