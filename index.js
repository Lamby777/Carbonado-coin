// Yet another random crypto coin
"use strict";

let blockchain = [];

// Imports
const Express = require("express"),
	HJSON = require("hjson"),
	fs = require("fs"),
	ALPHA58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
	base58 = require("base-x")(ALPHA58),
	cleanup = require("./cleanup");

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
const MINER_REWARD = 1;
let c = 50;

// Code Constants
const app = Express();
app.use(Express.json());

let tx = new Transaction(
	[
		new TxI(0, "id of txo", 2),
	], [
		new TxO("public key", 2, false),
	],
);

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

// Respond to "alive" checks in peer discovery
let {} = app.get("/ping", (req, res) => {
	console.log("yo");
	res.json({
		miner: config.miner,
	});
});

if (config.miner) {
	const axios = require("axios").default;
	let routersPush = config.pushToRouters;
	let routersPull = config.pullFromRouters;

	// PEER DISCOVERY

	// Put own IP on router lists
	routersPush.forEach((r) => {
		let {} = axios.post(r, {}
		).catch((error) => {
			console.error(error);
		});
	});

	// Take IPs from router lists
	routersPull.forEach((r) => {
		let {} = axios.get(r).then((res) => {
			// Run for each router

			let miners = res.data.content.miners;
			let ominers = miners.filter(async (peer) => {

				// Run for each peer in router
				let val = null;
				axios.get("http://" + peer + "/ping").then((res) => {
					console.log("Active Peer " + peer);
					val = true;
				}).catch((e) => {
					console.error(e.message);
					val = false;
				}).finally(() => {
					return val;
				});
			});

			peers = combineArrays(peers, ominers);
			//peers = peers.concat(ominers);
			console.log(peers);
		}).catch((e) => {console.error(e)}).finally(() => {
			//setTimeout(_ => console.log(peers), 3000);
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
	let difficulty = 3; // Set low because Replit doesn't like mining
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
			case "0": out += "0000"; break;
			case "1": out += "0001"; break;
			case "2": out += "0010"; break;
			case "3": out += "0011"; break;
			case "4": out += "0100"; break;
			case "5": out += "0101"; break;
			case "6": out += "0110"; break;
			case "7": out += "0111"; break;
			case "8": out += "1000"; break;
			case "9": out += "1001"; break;
			case "a": out += "1010"; break;
			case "b": out += "1011"; break;
			case "c": out += "1100"; break;
			case "d": out += "1101"; break;
			case "e": out += "1110"; break;
			case "f": out += "1111"; break;
			default: return "";
		}
	} return out;
}

function combineArrays(a, b) {
	return a.concat(b.filter((val) => !a.includes(val)));
}

/**
 * Generates a wallet address from Public Key
 * 
 * @param {String} key
 * @returns {String}
*/
function addressFromPubkey(key) {
	key = hash(key, "hex");
	let addr = base58.encode(Buffer.from(key));
}

/**
 * Reverse of addressFromPubkey();
 * 
 * @param {String} addr
 * @returns {Boolean}
 */
function validateWalletAddress(addr) {
	//
}


// More "borrowed" code from Tamás Sallai
/*async function asyncFilter(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_, index) => results[index]);
}*/
