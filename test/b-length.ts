"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test				from "ava";
import {blockchain}		from "../index";
import {Block}			from "../classes";

/**
 * Checks if the blockchain length works correctly.
 */

test.serial("Chain Lengths", async (t) => {
	
	// Push 99 dummy blocks to chain
	for (let i = 0; i<99; i++)
		Block.generate({transactions: []}, () => blockchain);
	
	// 99 blocks + 1 genesis = 100 blocks in chain
	t.is(blockchain.length, 100);
});
