const b = require("bcrypt");

class Block {
	constructor(num, timestamp, body, hash, previous) {
		this.num = num,
		this.timestamp = timestamp,
		this.body = body,
		this.hash = hash,
		this.previous = previous;
	}
}