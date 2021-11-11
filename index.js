// Yet another random crypto coin
"use strict";

// "Borrowed" from NodeJS documentation
const blockchain = [];
const {Block, hash} = require("./writeup.js")(blockchain);

const genesis = new Block(0, "", 1636563534866, {
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
});

let a = Block.generate();

console.log(blockchain);

// Functions

function verifyBlockchain(blockchain) {
	return blockchain.every(n => Block.verify(n));
}

function blockchainLengthDilemma(newChain) {
	if (newChain.length > blockchain.length &&	// New chain longer
		verifyBlockchain(newChain)) {			// New chain valid
		blockchain = newChain;
	}
}
