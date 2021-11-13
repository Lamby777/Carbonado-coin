// Yet another random crypto coin
"use strict";

// "Borrowed" from NodeJS documentation
const blockchain = [];
const port = 11870;
const {Block, hash} = require("./writeup.js")(blockchain);
const Express = require("express");
const app = Express();

const genesis = new Block(0, "", {
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
});

let a = Block.generate();

console.log(blockchain);
console.log(verifyBlockchain(blockchain));

// Blockchain receive algorithm
app.post("/nado/newBlock", (req, res) => {
	if (true /* change to flag later*/) {
		// Add new block to blockchain
		Block.generate();
	}
});

// Main mining algorithm
function runCarbon() {
	//
}


app.listen(port, () => {
	console.log("Carbonado listening on port " + port);
});

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
