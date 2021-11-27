"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test from "ava";
import * as main from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if the blockchain length works correctly.
 */

test("Blockchain Lengths", (test) => {
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	// Include genesis
	console.log("BLOCKCHAIN LENGTH: " + main.blockchain.length)
	test.assert(main.blockchain.length === 5);
});