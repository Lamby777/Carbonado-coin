"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import test					from "ava";
import request				from "supertest";
import {blockchain, app}	from "../index";
import {Block}				from "../classes";

/**
 * Checks if Express is listening for connections
 */

test.serial("/newBlock Integrity", async (t) => {
	let protoblock = () =>
		Block.generate({transactions: []}, null);

	// Dummy block not pushed to chain
	let block = protoblock();
	
	// POST request new valid block
	let reqValid = await request(app).post("/newBlock")
		.send({newBlockData: {...block}});
	t.is(reqValid.status, 201);

	// Assert chain length
	t.is(blockchain.length, 2);

	// Block's hash is tampered
	let fakeBlock = protoblock();
	
	fakeBlock.hash = "get hacked sucker lol";

	// Send fake block and wait for the inevitable Error 400
	let reqInvalid = await request(app).post("/newBlock")
		.send({newBlockData: {...fakeBlock}});
	
	// Assert error code and make sure chain isn't updated
	t.is(reqInvalid.status, 400);
	t.is(blockchain.length, 2);
});
