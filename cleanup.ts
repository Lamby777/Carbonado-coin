"use strict";
import * as fs from "fs";

function cleanup(mem: any) {
	// This script will run before task exit.
	console.log("Bye!");

	// Write exit time to memory
	mem.lastExit = Date.now();

	// Write memory to JSON file for next startup
	fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}

//module.exports = cleanup;
export = cleanup;
