"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test	from "ava";
import main	from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if a block's hash is stored in its successor.
 */

test.serial("Blockchain Hash Succession", async (t) => {
	let b1 = writeup.Block.generate({
		"transactions": ["yo"],
	});

	let b2 = writeup.Block.generate({
		"transactions": ["hey"],
	});

	t.is(b2.previous, b1.hash);
	t.true(main.verifyBlockchain(main.blockchain));
});
