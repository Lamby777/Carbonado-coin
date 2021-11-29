"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test from "ava";
import main from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if a block's hash is stored in its successor.
 */

test.serial("Blockchain Hash Succession", async (test) => {
	let b1 = writeup.Block.generate({
		"transactions": ["yo"],
	});

	let b2 = writeup.Block.generate({
		"transactions": ["hey"],
	});

	test.is(b2.previous, b1.hash);
	test.true(main.verifyBlockchain(main.blockchain));
});
