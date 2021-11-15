// Code writeup for use in index.js
"use strict";

const crypto = require("crypto");
const secret = process.env['SECRET'];

function exp(blockchain) {
	class Block {
		constructor(num, previous, body, timestamp, hash) {
			this.num = num ? num : blockchain.length,
			this.previous = previous, // Previous hash
			this.body = body !== undefined ? body : null,
			this.timestamp = timestamp || new Date().getTime(),
			this.hash = Block.hash(this);
		}

		static hash(block) {
			if (block instanceof Block) {
				return hash(block.num + block.previous +
						block.body + block.timestamp);
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
			// Genesis always valid
			if (block.num === 0) return true;
			
			// Innocent until proven guilty :)
			let valid = true;
			let prevBlock = blockchain.filter(val => val.num === block.num-1)[0];

			if ((!prevBlock) || // Block doesn't exist
				(prevBlock.hash !== block.previous) || // Block P-hash fail
				(Block.hash(block) !== block.hash)) { // Block was tampered
				valid = false;
			}
			return valid;
		}
	}

	function hash(input) {
		return crypto.createHmac('sha256', secret).update(input).digest("hex");
	}

	return {
		Block: Block,
		hash: hash,
	}
}

module.exports = exp;
