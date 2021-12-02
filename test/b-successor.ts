"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test					from "ava";
import {Block}				from "../classes";
import {verifyBlockchain}	from "../index";

/**
 * Checks if a block's hash is stored in its successor.
 */

test.serial("Hash Succession", async (t) => {
	let b1 = Block.generate({
		transactions: [],
	});

	let b2 = Block.generate({
		declarations: [],
	});

	t.is(b2.previous, b1.hash);
	t.true(verifyBlockchain((global as any).blockchain));
});
