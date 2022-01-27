/*import * as nat		from "nat-api";

const compat = pork.probeProtocolSupport();

// If none of the 3 methods are compatible...
if (!Object.values(compat).includes(true))
	throw new Error("Please enable PMP, PCP, or UPNP on your router.");

regLog("Attempting port forward...");
try {
	pork.addMapping(PORT, 11870, 7200);
} catch (e) {
	console.log("Port forwarding failed! Error:");
	throw e;
}

upnp.map({
	port:			[11870, 11870],
	protocol:		"TCP",
	description:	"Carbonado daemon",
}).catch(() => console.log("bruh")).then(() => console.log("amogus"));*/
