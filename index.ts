// Yet another random crypto coin
"use strict";

// Check execution method
if (!process.env.MODE) process.env.MODE = "main";
const testing = process.env.MODE === "test";
regLog(`Running in environment "${process.env.MODE}"`);

// Init pre-import variables
let blockchain: any[] = [];
const ALPHA58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Imports
import * as Express	from "express";
import * as HJSON	from "hjson";
import * as fs		from "fs";
import * as baseX	from "base-x";
import cleanup = require("./cleanup");
const base58 = baseX(ALPHA58);

// Import blockchain classes/functions from writeup
const {
	Block,
	Transaction,
	TxI, TxO,
	hash,
} = require("./writeup.js")(blockchain);


// Read files
const configContent: string = fs.readFileSync("config.hjson", "utf8");
let config: Record<string, any> = HJSON.parse(configContent);
let mem: Record<string, any> = {};
let peers: string[] = [];

// Override cetrain config values if testing
if (testing) config = {
	...config,
	miner: false,
}

// Parse memory file if exists
try {
	mem = JSON.parse(fs.readFileSync("nodemem.json", "utf8"));
} catch(e) {
	fs.writeFileSync("./nodemem.json", JSON.stringify(mem), "utf8");
}


// Hard Constants and Default Values
const PORT = 11870;
const MINER_REWARD = 1;
let c = 70;

// Start Express server for peers to use
const app = Express();
app.use(Express.json());


// Add genesis to blockchain
const genesis = new Block(0, "", {
	content: [],
}, 1636962514638);

blockchain.push(genesis);
//regLog(blockchain);



// Reply with blockchain if requested
let {} = app.get("/", (req, res) => {
	res.json(blockchain);
});

// Respond to "alive" checks in peer discovery
let {} = app.get("/ping", (req, res) => {
	regLog("yo");
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
					regLog("Active Peer " + peer);
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
		}).catch((e: Error) => {console.error(e)}).finally(() => {
			//setTimeout(_ => regLog(peers), 3000);
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
	regLog("Carbonado listening on port " + PORT);

	if (config.miner) {
		// Begin mining
		let {} = runCarbon(genesis);
	}
});



// Main mining algorithm
function runCarbon(block: InstanceType<typeof Block>) {
	let res, difficulty,
		solved = false,
		nonce = generateNonce();
	
	// Update difficulty
	if (testing) {
		difficulty = 3; // Set low because Replit doesn't like mining
	} else {
		difficulty = 3;
	}
	
	
	// Start hashing
	const correctPrefix = "0".repeat(difficulty);
	do {
		res = Block.hash(block, nonce, "hex");

		// Check if hash passes repeating 0s checksum
		if (hexToBinary(res)
			.startsWith(correctPrefix)) solved = true;

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

// Checks if blockchain given is valid
function verifyBlockchain(blockchain: any[]): boolean {
	return blockchain.every(n => Block.verify(n));
}

function blockchainLengthDilemma(newChain: any[]): void {
	if (newChain.length > blockchain.length &&	// New chain longer
		verifyBlockchain(newChain)) {			// New chain valid
		blockchain = newChain;
	}
}

function generateNonce(): number {
	return Math.random() * Date.now();
}

// Gonna be real with you, I took this straight from "The Stack"
function hexToBinary(hex: string): string {
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
function combineArrays(a: any[], b: any[]): any[] {
	return a.concat(b.filter((val) => !a.includes(val)));
}

// Generates a wallet address from Public Key
function addressFromPubkey(key: string): string {
	key = hash(key, "hex");
	let addr = base58.encode(Buffer.from(key));
	return key;
}

// Reverse of addressFromPubkey();
function validateWalletAddress(addr: string): boolean {
	//
	return true; // typescript moment :/
}

function regLog(...val: any[]): void {
	if (!testing) console.log(...val);
}

// More "borrowed" code from Tamás Sallai
/*async function asyncFilter(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_, index) => results[index]);
}*/

export {
	PORT,
	MINER_REWARD,
	c,
	blockchain,
	Block, Transaction, TxI, TxO,
	hash,
	mem,
	peers,
	config,
	runCarbon,
	verifyBlockchain,
	blockchainLengthDilemma,
	generateNonce,
	hexToBinary,
	addressFromPubkey,
	validateWalletAddress,
}
