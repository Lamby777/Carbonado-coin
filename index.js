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
}
