// Script that runs for graceful exit
"use strict";
import * as fs from "fs";
const testing = process.env.MODE.startsWith("test-");

// Runs on sigterm / exit
function cleanup(mem: any): void {
	// Write exit time to memory
	mem.lastExit = Date.now();

	// Write memory to JSON file for next startup
	if (!testing) // Don't save mem for unit tests
		fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}

export default cleanup;
