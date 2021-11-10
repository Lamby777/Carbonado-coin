// Yet another random crypto coin
"use strict";

// "Borrowed" from NodeJS documentation
const crypto = require("crypto");
const secret = process.env['SECRET'];
const algo = crypto.createHmac('sha256', secret)
const genesis = new Block(0, "", 1636563534866, {
	//
});

const blockchain = [genesis];

class Block {
	constructor(num, previous, body, timestamp, hash) {
		this.num = num,
		this.previous = previous,
		this.body = body,
		this.timestamp = timestamp,
		this.hash = makeHashOf(this);
	}

	static makeHashOf(block) {
		if (block instanceof Block) {
			return hash(num + previous + body + timestamp);
		} else {
			throw TypeError("Attempt to get hash of non-block");
		}
	}

	static generateNextBlock(body) {
		let prevBlock = getLatestBlock();
		let previous = prevBlock.hash;
		let num = previous.index + 1;
		let timestamp = new Date().toLocaleString(
			'en-US', { timeZone: 'America/New_York' });
		let block = new Block(num, previous, body, timestamp);
		//block.hash = makeHashOf(block);
		return block;
	};
}

function hash(input) {
	return algo.update(input).digest("hex");
}
