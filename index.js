// Yet another random crypto coin
"use strict";

// "Borrowed" from NodeJS documentation
const crypto = require("crypto");
const secret = process.env['SECRET'];
const algo = crypto.createHmac('sha256', secret)

class Block {
	constructor(num, previous, body, timestamp, hash) {
		this.num = num,
		this.previous = previous,
		this.body = body,
		this.timestamp = timestamp,
		this.hash = hash;
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
		let hash = hash(num + previous + body + timestamp);
		let block = new Block(num, previous, body, timestamp, hash);
		return block;
	};
}

function hash(input) {
	return algo.update(input).digest("hex");
}
