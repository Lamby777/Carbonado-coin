import portcon			from "nat-api";
import dgateway			from "default-gateway";
import pmp				from "nat-pmp";
import { promisify }	from "util";

const MAPPING_TTL = 3600;

const defaultGateway = dgateway.v4.sync().gateway;

const client = new portcon({
	enablePMP:	true,
	gateway:	defaultGateway,
});

// Port control client singleton
export default ({
	async attemptMap(port: number) {
		// Warn about custom ports
		if (port !== 11870) console.warn(
			"WARNING: Using custom ports will make it so nobody " +
			"will connect to your node. Don't do this unless you " +
			"know exactly what you're doing!" );
		
		/*let didPmpWork = await this.attemptPmp(defaultGateway, port);
		if (!didPmpWork) {
			// If PMP didn't work, attempt UPnP
			
			
			if (true) {
				// Finally, try PCP
				
				if (true) {
					console.log("bruh");
					// Throw error if none of the 3 worked.
					return false
				}
			}
		} else console.log(didPmpWork);*/
		
		this.mapViaNatApi(port);
		
		return true;
		console.log(`Mapped internal to external (Port ${port}) for TCP`);
	},
	
	async attemptPmp(routerIp: string, port: number) {
		const client = pmp.connect(routerIp);
		
		// Run portMapping as async to avoid callback hell
		return await promisify(client.portMapping)({
			private:	port,
			public:		port,
			ttl:		MAPPING_TTL,
			type:		"TCP"
		}).catch(err => err);
	},
	
	mapViaNatApi(port: number) {
		client.map({
			publicPort:		port,
			privatePort:	port,
			ttl:			MAPPING_TTL,
			protocol:		"TCP",
		}, (err: Error) => {
			if (err) throw err;
			console.log("Done!");
		});
	}
});
