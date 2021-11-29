"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test from "ava";
import request from "supertest";
import * as main from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if Express is listening on port 11870
 */

test.serial("Express Server Listening", async (test) => {
	let req = request(main.app);
	test.is((await req.get("/")).status, 200);
	test.is((await req.get("/ping")).status, 200);
});
