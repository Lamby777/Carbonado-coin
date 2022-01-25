"use strict";

// Specify execution method
process.env.MODE = "test mine";

// Imports
import test					from "ava";
import * as upnp			from "./../upnp";

/**
 * Checks if UPNP is working properly,
 * and NAT is not preventing communication
 */

test.serial("UPNP", async (t) => {
	var myIp = require("node-ip");
	console.log(myIp);
	console.log(myIp.address());
	
	var timeout = 15000; //ms
	
	upnp.searchGateway(timeout, (err: any, gateway: any) => {
		if (err) throw err;

		console.log("Found Gateway!");
		console.log("Fetching External IP ... ");
		
		gateway.getExternalIP((err: any, ip: any) => {
			if (err) throw err;
			console.log(ip);
			console.log("Mapping port 8888->"+myIp+":8888 ... ");
	
			gateway.AddPortMapping(
				"TCP",
				8888,
				8888,
				myIp,
				"YOUR DESCRIPTION",
				(err: any) => {	
					if (err) throw err;
				
					console.log("Success");
				}
			);
		});
	});
	
	// Assert error code and make sure chain isn't updated
	t.is(1, 2);
});
