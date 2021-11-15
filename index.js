// Yet another random crypto coin
"use strict";

// Imports
const Express = require("express");
const HJSON = require("hjson");
const fs = require("fs");
const net = require("net");

// Get User Config Constants
const configContent = fs.readFileSync("config.hjson", "utf8");
const config = HJSON.parse(configContent);
const isMiner = config.miner;

// Code Constants
const PORT = 11870;
const blockchain = [];
const {Block, hash} = // Pass blockchain to writeup
	require("./writeup.js")(blockchain);



const app = Express();
app.use(Express.json());

const genesis = Block.generate({
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
});
Block.generate();

console.log(blockchain);

if (isMiner) (function () {
	const wrtc = require("wrtc");
	const Exchange = require("peer-exchange");
	
	let carbonEx = new Exchange("Carbon", {wrtc: wrtc});
	
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
})();


let {} = app.listen(PORT, () => {
	console.log("Carbonado listening on port " + PORT);
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
