"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import test					from "ava";
//import * as upnp			from "./../upnp";

/**
 * Checks if UPNP is working properly,
 * and NAT is not preventing communication
 */

test.serial("UPNP", async (t) => {
	//
	
	// Assert error code and make sure chain isn't updated
	t.is(1, 2);
});
