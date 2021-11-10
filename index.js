"use strict";
// Yet another random coin

// "Borrowed" from NodeJS documentation
const crypto = require("crypto");
const secret = process.env['SECRET'];
const algo = crypto.createHmac('sha256', secret)

class Block {
	constructor(num, timestamp, body, hash, previous) {
		this.num = num,
		this.timestamp = timestamp,
		this.body = body,
		this.hash = hash,
		this.previous = previous;
	}

	static makeHashOf(block) {
		if (block instanceof Block) {
			return hash(num + previous + body + timestamp);
		} else {
			throw TypeError("Attempt to get hash of non-block");
		}
	}
}

function hash(input) {
	return algo.update(input).digest("hex");
}
