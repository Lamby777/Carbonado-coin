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


const genesis = new Block(0, "", {
	sender: "Dex",
	recipient: "Tomato",
	content: {type: "Diamond", quantity: 1},
}, 1636962514638);

blockchain.push(genesis);

Block.generate();
console.log(blockchain);



// Reply with blockchain
let {} = app.get("/", (req, res) => {
	res.json(blockchain);
});

if (isMiner) (function () {

	// Blockchain receive algorithm
	let {} = app.post("/newBlock", (req, res) => {
		if (true /* change to flag later*/) {
			// Add new block to blockchain
			Block.generate();
		}
	});

	// Main mining algorithm
	function runCarbon(block) {
		let solved = false;
		let res;
		let nonce = Math.floor(Math.random() * 10000);
		do {
			res = Block.hash(block, nonce, "binary");
			if (false) { // If someone else solved
				res = null;
				break;
			}
		} while (!solved)

		if (res) { // If didn't exit early
			// Send results to other nodes
		}
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
