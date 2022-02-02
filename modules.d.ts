declare module "nat-api" {
	interface mapping {
		publicPort?:	number,
		privatePort?:	number,
		ttl?:			number,
		protocol?:		"TCP" | "UDP",
	}
	
	export default class NatAPI {
		constructor(options: {
			ttl?:			number,
			autoUpdate?:	boolean,
			gateway?:		string,
			enablePMP?:		boolean,
		});
		
		map(port: number | mapping, callback: Function): Promise<Error>;
	}
}

declare module "nat-pmp" {
	interface mapping {
		private:	number;
		public:		number;
		ttl:		number;
		type:		"TCP" | "UDP";
	}
	
	export function connect(gatewayIp: string): Client;
	
	export class Client {
		portMapping(
			m: mapping,
			callback: (err: Error, info: string) => void
		): void;
	}
}
