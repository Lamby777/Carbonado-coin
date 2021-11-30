"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import test		from "ava";
import request	from "supertest";
import main		from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if Express is listening for connections
 */

test.serial("Express Server Listening", async (t) => {
	// Wipe blockchain
	writeup.Block.generate();

	let newChain = main.blockchain;
	
	// POST request new valid block
	let req = await request(main.app).post("/newBlock")
	t.is(req.status, 200);
	t.is(main.blockchain.length, 2)
});
