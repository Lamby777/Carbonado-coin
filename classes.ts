// Code writeup module for use in index.js
"use strict";

import {blockchain}	from "./index";
import * as crypto	from "crypto";
import {ec as EC}	from "elliptic";
const ec = new EC("secp256k1");

const keypair = "test";

// Amazing how you can write "type Script" in TypeScript
export interface Script {
	code: string,
	sigs: Record<string, string>,
	author?: string,
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

export class Wallet {}

export class Transaction {
	public static all: Transaction[];
	public index: number;
	
	constructor(public sender: Wallet, public outputs: Wallet) {
		this.index = Transaction.all.length;
		Transaction.all.push(this);
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
	public localeCVal: number | null; // Hey, that rhymes!
	public nonces: number[];
	public solvedBy: string[];

	constructor(
		public num?: number,
		public previous?: string,
		public body?: BlockBody | null, // fix later
		public timestamp?: number,
		public hash?: string) {

		this.num = num ?? blockchain.length,
		this.previous = previous, // Previous hash
		this.body = body !== undefined ? body : null,
		this.timestamp = timestamp || Date.now(),
		this.localeCVal = null, // Difficulty at mine-time
		this.nonces = [],
		this.solvedBy = [],
		this.hash = hash ?? Block.hash(this);
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

	static generate(body: BlockBody,
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
		if (chain && chain()) chain().push(block);
		return block;
	}


	static verify(block: Block): boolean {
		let prevBlock = blockchain.filter(val => val.num === block.num-1)[0];

		const failCases = [
			// Block hash doesn't match own recorded hash
			Block.hash(block) !== block.hash,
			
			// Block was sent by a time-traveler... or a hacker.
			block.timestamp > Date.now(),

			///// Following checksums do not apply for genesis
			
			// Previous block does not exist
			block.num !== 0 && !prevBlock,

			// Block's recorded prevhash doesn't match previous's hash
			block.num !== 0 && prevBlock.hash !== block.previous,
		]
		
		// Check for tampering
		return !(failCases.includes(true));
	}
}
