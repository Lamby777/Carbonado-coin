// Code writeup module for use in index.js
"use strict";

const crypto = require("crypto");

function exp(blockchain) {
	class Block {
		constructor(num, previous, body, timestamp, hash) {
			this.num = num ? num : blockchain.length,
			this.previous = previous, // Previous hash
			this.body = body !== undefined ? body : null,
			this.timestamp = timestamp || new Date().getTime(),
			this.difficultyLocale = null, // Difficulty at the time of verification
			this.nonces = [],
			this.hash = Block.hash(this);
		}

		static hash(block, nonce, format) {
			if (block instanceof Block) {
				let trueNonce = nonce ? nonce : block.nonces[0]; // For mining 
				let input = block.num + block.previous +
						block.body + block.timestamp;
				if (trueNonce) input += trueNonce;
				return hash(input, format);
			} else {
				throw TypeError("Attempt to get hash of non-block");
			}
		}

		static generate(body) {
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
			blockchain.push(block);
			return block;
		}


		static verify(block) {
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
		constructor() {
			//
		}
	}

	function hash(input, format) {
		return crypto.createHash("sha256")
			.update(input).digest(format ? format : "base64");
	}

	return {
		Block: Block,
		Transaction: Transaction,
		hash: hash,
	}
}

module.exports = exp;
