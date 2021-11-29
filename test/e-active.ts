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
	let req = await request(main.app).get("/");
	test.is(req.status, 200);

	return test.pass();
});
