// Yet another random crypto coin
"use strict";

let blockchain: any[] = [];
const ALPHA58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Imports
import * as Express from "express";
import * as HJSON from "hjson";
import * as fs from "fs";
import * as baseX from "base-x";
import cleanup from "./cleanup";
const base58 = baseX(ALPHA58);

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
let peers: string[] = [];
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
	routersPush.forEach((r: string) => {
		let {} = axios.post(r, {}
		).catch((e: Error) => {
			console.error(e);
		});
	});

	// Take IPs from router lists
	routersPull.forEach((r: string) => {
		let {} = axios.get(r).then((res: any) => {
			// Run for each router

			let miners = res.data.content.miners;
			let ominers = miners.filter(async (peer: any) => {

				// Run for each peer in router
				let val: boolean = null;
				axios.get("http://" + peer + "/ping").then((res: any) => {
					console.log("Active Peer " + peer);
					val = true;
				}).catch((e: Error) => {
					console.error(e.message);
					val = false;
				}).finally(() => {
					return val;
				});
			});

			peers = combineArrays(peers, ominers);
			//peers = peers.concat(ominers);
			console.log(peers);
		}).catch((e: Error) => {console.error(e)}).finally(() => {
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
function runCarbon(block: InstanceType<typeof Block>) {
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

function doCleanup() {
	cleanup(mem);
}

let {} = process.on("exit", doCleanup);

let {} = process.on("SIGINT", () => {
	process.exit(2);
});





// Functions

/**
 * Checks if blockchain given is valid
 * @param {Array} blockchain
 * @returns {Boolean}
 */
function verifyBlockchain(blockchain: any[]) {
	return blockchain.every(n => Block.verify(n));
}

function blockchainLengthDilemma(newChain: any[]) {
	if (newChain.length > blockchain.length &&	// New chain longer
		verifyBlockchain(newChain)) {			// New chain valid
		blockchain = newChain;
	}
}

function generateNonce() {
	return Math.random() * Date.now();
}

/**
 * Gonna be real with you, I took this straight from "The Stack"
 * @param {String} hex
 * 
 * @returns {String}
 */
function hexToBinary(hex: string) {
	hex = hex.replace("0x", "").toLowerCase();
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

// Merges 2 arrays while removing duplicates
function combineArrays(a: any[], b: any[]) {
	return a.concat(b.filter((val) => !a.includes(val)));
}

// Generates a wallet address from Public Key
function addressFromPubkey(key: string) {
	key = hash(key, "hex");
	let addr = base58.encode(Buffer.from(key));
}

// Reverse of addressFromPubkey();
function validateWalletAddress(addr: string) {
	//
}


// More "borrowed" code from Tamás Sallai
/*async function asyncFilter(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_, index) => results[index]);
}*/
