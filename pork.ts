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
		
		let success = await this.mapViaNatApi(port);
		
		if (!success) {
			// Attempt another method if didn't work
			
			// Finally, return false if nothing worked
			console.log("bruh");
			return false;
		}
		
		console.log(`Mapped internal to external (Port ${port}) for TCP`);
		return true;
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
	
	async mapViaNatApi(port: number) {
		return await promisify(client.map)({
			publicPort:		port,
			privatePort:	port,
			ttl:			MAPPING_TTL,
			protocol:		"TCP",
		});
	}
});
