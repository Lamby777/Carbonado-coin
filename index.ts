// Yet another random crypto coin
"use strict";

// Check execution method
if (!process.env.MODE) process.env.MODE = "main";
const {mode, testing, mine} = parseEnvMode();
regLog(`Running in environment "${process.env.MODE}"`);

// Init pre-import variables
const ALPHA58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Imports
import Express		from "express";
import * as HJSON	from "hjson";
import * as fs		from "fs";
import baseX		from "base-x";
import axios		from "axios";
import cleanup		from "./cleanup";

import {
	Block,
	Transaction,
	TxI, TxO,
	hash,
} from "./classes";

const base58 = baseX(ALPHA58);

// Import blockchain classes/functions from writeup
type BlockType = InstanceType<typeof Block>;
(global as any).blockchain = [];

// Read files
const configContent: string = fs.readFileSync("config.hjson", "utf8");
let config: Record<string, any> = HJSON.parse(configContent);
let mem: Record<string, any> = {};
let peers: string[] = [];

// Override cetrain config values if testing
if (testing) config = {
	...config,
	miner: mine,
}

// Parse memory file if exists
try {
	mem = JSON.parse(fs.readFileSync("nodemem.json", "utf8"));
} catch(e) {
	fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}


// Hard Constants and Default Values
const PORT = 11870;
const MINER_REWARD = 1;
let c = 70;

// Start Express server for peers to use
const app = Express();
app.use(Express.json());


// Add genesis to blockchain
const genesis: BlockType = new Block(0, "", {
	transactions: [],
}, 1636962514638);

(global as any).blockchain.push(genesis);



// Reply with blockchain if requested
let {} = app.get("/", (req: any, res: any) => {
	res.json({
		blockchain: (global as any).blockchain,
		timestamp: Date.now(),
	});
});

// Respond to "alive" checks in peer discovery
let {} = app.get("/ping", (req: any, res: any) => {
	regLog("yo");
	res.json({
		miner: config.miner,
	});
});

if (config.miner) {
	let routersPush = config.pushToRouters;
	let routersPull = config.pullFromRouters;

	// Blockchain receive algorithm
	let {} = app.post("/newBlock", (req, res) => {
		// Validate block
		let blockData = req.body?.newBlockData;
		if (!blockData) return res.end(400);

		let block: BlockType = new Block(
			blockData.num, blockData.previous,
			blockData.body, blockData.timestamp,
			blockData.hash
		);

		let valid: boolean = Block.verify(block);


		// If valid, add to chain
		if (valid /* valid block */) {
			// Then add new block to local blockchain
			(global as any).blockchain.push(block);
			res.status(201);
		} else {
			res.status(400);
		} res.end();
	});

	// PEER DISCOVERY

	// Put own IP on router lists
	routersPush.forEach((r: string) => {
		let {} = axios.post(r, {}).catch((e: Error) => console.error(e));
	});

	// Take IPs from router lists
	routersPull.forEach((r: string) => {
		let {} = axios.get(r).then((res) => {
			// Run for each router

			let miners = res.data.content.miners;
			let ominers = miners.filter(async (peer: string) => {
				// Run for each peer in router
				let val: boolean = null;
				axios.get("http://" + peer + "/ping").then((res) => {
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
};

let appListen = app.listen(PORT, () => {
	regLog("Carbonado listening on port " + PORT);

	if (config.miner) {
		// Begin mining
		let {} = runCarbon(genesis);
	}
});



// Main mining algorithm
function runCarbon(block: BlockType) {
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
	if (newChain.length > (global as any).blockchain.length &&	// New chain longer
		verifyBlockchain(newChain)) {			// New chain valid
		(global as any).blockchain = newChain;
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
	return true; // typescript moment :/
}

// To prevent spam, this one will not log if testing
function regLog(...val: any[]): void {
	if (!testing) console.log(...val);
}

function wipeChain() {
	(global as any).blockchain = [genesis];
}

// Parse "mode" env var into object containing flags
function parseEnvMode() {
	const marr: string[] = process.env.MODE.toLowerCase().split(" ");

	return {
		mode:		marr[0],
		testing:	marr[0] === "test",
		mine:		marr.includes("mine"),
	};
}

// Export for AVA unit testing
export {
	PORT,
	MINER_REWARD,
	c,
	genesis,
	Block, Transaction, TxI, TxO,
	app, appListen,
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
	wipeChain,
	parseEnvMode,
}
