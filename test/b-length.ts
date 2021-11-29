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

test.serial("Blockchain Lengths", async (test) => {
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	// 4 blocks + 1 genesis = 5 blocks in chain
	test.assert(main.blockchain.length === 5);
});