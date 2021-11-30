"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test	from "ava";
import main	from "../index";
import writeupReturner	from "../writeup";
const writeup = writeupReturner(main.blockchain);

/**
 * Checks if the blockchain length works correctly.
 */

test.serial("Chain Lengths", async (t) => {
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	writeup.Block.generate({});
	// 4 blocks + 1 genesis = 5 blocks in chain
	t.is(main.blockchain.length, 5);
});