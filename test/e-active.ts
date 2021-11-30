"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test		from "ava";
import request	from "supertest";
import main		from "../index";
import writeupReturner	from "../writeup";
const writeup = writeupReturner(main.blockchain);

/**
 * Checks if Express is listening for connections
 */

test.serial("Server Up", async (t) => {
	let req = request(main.app);
	t.is((await req.get("/")).status, 200);
	t.is((await req.get("/ping")).status, 200);
});
