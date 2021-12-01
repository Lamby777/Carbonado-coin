"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import test		from "ava";
import request	from "supertest";
import main		from "../index";
import writeupReturner	from "../writeup";
const writeup = writeupReturner(main.blockchain);

/**
 * Checks if Express is listening for connections
 */

test.serial("/newBlock Integrity", async (t) => {
	// Wipe blockchain
	let block = writeup.Block.generate({
		content: [],
	}, null);

	//let newChain = main.blockchain;
	
	// POST request new valid block
	let reqValid = await request(main.app).post("/newBlock")
		.send({newBlockData: {...block}});
	t.is(reqValid.status, 201);

	// Chain length
	t.is(main.blockchain.length, 2);

	let fakeBlock = writeup.Block.generate({
		content: [],
	}, null);

	fakeBlock.hash = "get hacked sucker lol";

	console.log(fakeBlock.hash);

	let reqInvalid = await request(main.app).post("/newBlock")
		.send({newBlockData: {...fakeBlock}});
	
	t.is(reqInvalid.status, 400);
	t.is(main.blockchain.length, 2);
});
