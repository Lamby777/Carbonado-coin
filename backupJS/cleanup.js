"use strict";
const fs = require("fs");

module.exports = function cleanup(mem) {
	// This script will run before task exit.

	// Write memory to JSON file for next startup
	fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}