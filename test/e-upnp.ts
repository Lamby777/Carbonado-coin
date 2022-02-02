"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import pork		from "../pork";
import test		from "ava";

/**
 * Checks if UPNP is working properly,
 * and NAT is not preventing communication
 */

test.serial("UPNP", async (t) => {
	// Await port map
	// attemptMap() returns status of port mapping
	t.assert(await pork.attemptMap(11870));
});
