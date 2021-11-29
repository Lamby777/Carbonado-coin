"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test		from "ava";
import request	from "supertest";
import main		from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if Express is listening for connections
 */

test.serial("Express Server Listening", async () => {
	// Wipe blockchain
	blockchain = [genesis];

	writeup.Block.generate();

	let newChain = main.blockchain;
	
	// POST request new valid block
	let req = await request(main.app).post("/newBlock")
	test.is(req.status, 200);
	test.is(main.blockchain.length, 2)
});
