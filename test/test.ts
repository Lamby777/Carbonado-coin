// Run tests for Carbonado
"use strict";

process.env.MODE = "test";
import test from "ava";
import * as index from "../index";

test("Blockchain Succession", (t) => {
	console.log(index.hash);
	t.pass();
});
