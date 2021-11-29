"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test from "ava";
import request from "supertest";
import main from "../index";
const writeup = require("../writeup")(main.blockchain);

/**
 * Checks if Express is listening for connections
 */

test.serial("Express Server Listening", async (test) => {
	let req = request(main.app);
	test.is((await req.get("/")).status, 200);
	test.is((await req.get("/ping")).status, 200);
});
