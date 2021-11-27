"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test from "ava";
import * as main from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if a block's hash is stored in its successor.
 */

test("Blockchain Hash Succession", (test) => {
	let b1 = writeup.Block.generate({
		"transactions": ["yo"],
	});

	let b2 = writeup.Block.generate({
		"transactions": ["hey"],
	});

	if (b2.previous === b1.hash) {
		if (main.verifyBlockchain(main.blockchain)) {
			return test.pass();
		}
	}

	return test.fail();
});
