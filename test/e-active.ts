"use strict";

// Specify execution method
process.env.MODE = "test";

// Imports
import test		from "ava";
import {Block}	from "../classes";
import request	from "supertest";
import {app}	from "../index";

/**
 * Checks if Express is listening for connections
 */

test.serial("Server Up", async (t) => {
	let req = request(app);
	t.is((await req.get("/")).status, 200);
	t.is((await req.get("/ping")).status, 200);
});
