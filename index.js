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

if (isMiner) {

	// Blockchain receive algorithm
	let {} = app.post("/newBlock", (req, res) => {
		if (true /* change to flag later*/) {
			// Add new block to blockchain
			Block.generate();
		}
	});

	//
};


let {} = app.listen(PORT, () => {
	console.log("Carbonado listening on port " + PORT);
});

let {} = runCarbon(genesis);

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

// Main mining algorithm
function runCarbon(block) {
	let res,
		solved = false,
		nonce = Math.floor(Math.random() * 10000);
	
	// Update difficulty
	let difficulty = 18;

	// Start hashing
	do {
		res = Block.hash(block, nonce, "hex");
		if (hexToBinary(res)
			.startsWith("0".repeat(difficulty))) solved = true;

		// If someone else solved
		if (false) {
			res = null;
			break;
		}

		nonce++;
	} while (!solved)

	if (res) { // If didn't exit early
		console.log(hexToBinary(res));
		console.log(nonce);
		// Send results to other nodes
		
		// Then resolve promise
		return res;
	}
}

// Gonna be real with you, I took this straight from "The Stack"
function hexToBinary(hex){
	//hex = hex.replace("0x", "").toLowerCase();
	var out = "";
	for(var c of hex) {
		switch(c) {
			case '0': out += "0000"; break;
			case '1': out += "0001"; break;
			case '2': out += "0010"; break;
			case '3': out += "0011"; break;
			case '4': out += "0100"; break;
			case '5': out += "0101"; break;
			case '6': out += "0110"; break;
			case '7': out += "0111"; break;
			case '8': out += "1000"; break;
			case '9': out += "1001"; break;
			case 'a': out += "1010"; break;
			case 'b': out += "1011"; break;
			case 'c': out += "1100"; break;
			case 'd': out += "1101"; break;
			case 'e': out += "1110"; break;
			case 'f': out += "1111"; break;
			default: return "";
		}
	}

return out;
}