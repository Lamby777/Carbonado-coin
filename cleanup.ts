"use strict";
import * as fs from "fs";

function cleanup(mem: object) {
	// This script will run before task exit.

	// Write memory to JSON file for next startup
	fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}

//module.exports = cleanup;
export default cleanup;
