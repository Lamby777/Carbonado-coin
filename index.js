// Yet another random crypto coin
"use strict";

// "Borrowed" from NodeJS documentation
const writeup = require("./writeup.js");
const genesis = new Block(0, "", 1636563534866, {
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
});

const blockchain = [genesis];
