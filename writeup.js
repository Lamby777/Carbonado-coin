// Code writeup module for use in index.js
"use strict";

const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

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
		constructor(id, inputs, outputs) {
			this.id = id,
			this.inputs = inputs,
			this.outputs = outputs;
		}

		get id() {
			let inputData = this.inputs
				.map((txI) => txI.to)
				.reduce((a, b) => a + b, "");

			let outputData = this.outputs
				.map((txO) => txO.addr + txO.amount)
				.reduce((a, b) => a + b, "");
			
			return Transaction.hash(inputData, outputData);
		}

		// Does the same thing as hash()
		// Only added this for code maintainability
		static hash(inputs, outputs) {
			return hash(inputs + outputs);
		}
	}

	class TxI {
		constructor(fromNum, /*fromId,*/ sig) {
			this.fromNum = fromNum,
			//this.fromId = fromId,
			this.sig = sig;
		}

		// Honestly, I'm kinda confused what this method does,
		// but it works and I'm happy about that.
		// Thanks, lhartikk, I guess.
		static sign(transaction, txI, privKey, UTXOs) {
			if (txI instanceof Number) {
				txI = transaction.inputs[txInum];
			}

			const sigData = transaction.id();
			const referencedUTXO = TxO.getUnspentByNum(
				/*txI.fromId,*/ txI.fromNum, UTXOs);
			//const referencedAddress = referencedUTXO.address;
			const key = ec.keyFromPrivate(privKey, "hex");
			return key.sign(sigData).toDER();
		}
	}

	class TxO {
		static unspent = [];

		constructor(num, addr, amount, spent) {
			this.num = num,
			this.addr = addr,
			this.amount = amount;
			this.spent = !!spent;

			// Push to UTXOs list if not spent
			if (!spent) TxO.unspent.push(this);
		}

		static getUnspentByNum(num) {
			return unspent.find(val => val.num === num);
		}
	}

	function hash(input, format) {
		return crypto.createHash("sha256")
			.update(input).digest(format ? format : "hex");
	}

	return {
		Block: Block,
		Transaction: Transaction,
		TxI: TxI,
		TxO: TxO,
		hash: hash,
	}
}

module.exports = exp;
