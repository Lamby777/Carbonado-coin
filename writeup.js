/**
* Code writeup for use in index.js
*/ "use strict";

const crypto = require("crypto");
const secret = process.env['SECRET'];
const algo = crypto.createHmac('sha256', secret)

class Block {
	constructor(num, previous, body, timestamp, hash) {
		this.num = num,
		this.previous = previous,
		this.body = body,
		this.timestamp = timestamp,
		this.hash = Block.makeHashOf(this);
	}

	static makeHashOf(block) {
		if (block instanceof Block) {
			return hash(block.num + block.previous +
					block.body + block.timestamp);
		} else {
			throw TypeError("Attempt to get hash of non-block");
		}
	}

	static generateNextBlock(body) {
		let prevBlock = getLatestBlock();
		let previous = prevBlock.hash;
		let num = previous.index + 1;
		let timestamp = new Date().getTime();//.toLocaleString(
			//'en-US', { timeZone: 'America/New_York' });
		let block = new Block(num, previous, body, timestamp);
		//block.hash = makeHashOf(block);
		return block;
	};
}

function hash(input) {
	return algo.update(input).digest("hex");
}

module.exports = {
	Block: Block,
	hash: hash,
}