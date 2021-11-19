// Yet another random crypto coin
"use strict";

let blockchain = [];

// Imports
const Express = require("express");
const HJSON = require("hjson");
const fs = require("fs");
const cleanup = require("./cleanup");

// Import blockchain classes/functions from writeup
const {
	Block,
	Transaction,
	TxI, TxO,
	hash,
} = require("./writeup.js")(blockchain);


// Read files
const configContent = fs.readFileSync("config.hjson", "utf8");
const memoryFileContent = fs.readFileSync("nodemem.json", "utf8");
const config = HJSON.parse(configContent);
let mem = {};
let peers = [];
try {
	mem = JSON.parse(memoryFileContent);
} catch(e) {
	fs.writeFileSync("./nodemem.json", JSON.stringify(mem), "utf8");
}

// Hard Constants
const PORT = 11870;

// Code Constants
const app = Express();
app.use(Express.json());

const genesis = new Block(0, "", {
	content: [
//		new TxO(addr, amount, spent),
//		new TxI(fromNum, txId, amount, sig),
	],
}, 1636962514638);

blockchain.push(genesis);



console.log(blockchain);



// Reply with blockchain if requested
let {} = app.get("/", (req, res) => {
	res.json(blockchain);
});

if (config.miner) {
	const axios = require('axios');
	let routers = config.pushToRouters

	routers.forEach((r) => {
		let {} = axios.post(r, {}
		).catch((error) => {
			console.error(error);
		});
	});

	// Blockchain receive algorithm
	let {} = app.post("/newBlock", (req, res) => {
		if (true /* change to flag later*/) {
			// Add new block to blockchain
			Block.generate();
		}
	});
};

let {} = app.listen(PORT, () => {
	console.log("Carbonado listening on port " + PORT);

	if (config.miner) {
		// Begin mining
		let {} = runCarbon(genesis);
	}
});






// Main mining algorithm
function runCarbon(block) {
	let res,
		solved = false,
		nonce = generateNonce();
	
	// Update difficulty
	let difficulty = 15; // Set low because Replit doesn't like mining
	let difficultyString = "0".repeat(difficulty); // Hash must begin with this

	// Start hashing
	do {
		res = Block.hash(block, nonce, "hex");

		// Check if hash passes repeating 0s checksum
		if (hexToBinary(res)
			.startsWith(difficultyString)) solved = true;

		// Check if someone else solved
		if (false) {
			res = null;
			break;
		}

		nonce++;
	} while (!solved)

	if (res) { // If didn't exit early
		console.log(`Verified block ${block.num} nonce ${nonce}`);
		// Send results to other nodes
		
		// Then resolve promise
		return res;
	}
}


// On exit

let {} = process.on("cleanup", () => cleanup(mem));

let {} = process.on("exit", () => {
	process.emit("cleanup");
});

let {} = process.on("SIGINT", () => {
	process.exit(2);
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

function generateNonce() {
	return parseInt(Math.random() * Date.now());
}

// Gonna be real with you, I took this straight from "The Stack"
function hexToBinary(hex) {
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
	} return out;
}
