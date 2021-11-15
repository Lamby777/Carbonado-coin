// Yet another random crypto coin
"use strict";

// User Config Constants
const isMiner = true; // True = Miner, False = Blockchain host

// Code Constants
const blockchain = [];
const port = 11870;
const {Block, hash} = require("./writeup.js")(blockchain);
const Express = require("express");
const app = Express();
app.use(Express.json());

const genesis = Block.generate({
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
});
Block.generate();

console.log(blockchain);

if (isMiner) {
	// Blockchain give algorithm (Reply to peers, like a simple torrent)
	let {} = app.get("/", (req, res) => {
		res.json(blockchain);
	});

	// Blockchain receive algorithm
	let {} = app.post("/newBlock", (req, res) => {
		if (true /* change to flag later*/) {
			// Add new block to blockchain
			Block.generate();
		}
	});

	// Main mining algorithm
	function runCarbon() {
		//
	}
}


let {} = app.listen(port, () => {
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
