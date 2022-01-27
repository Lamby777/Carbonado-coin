declare module "freedom-port-control" {
	export function probeProtocolSupport(): {
		"natPmp":	boolean,
		"pcp":		boolean,
		"upnp":		boolean,
	}

	export function addMapping(internal: number, external: number,
							   life: number): void;
}

declare module "nat-upnp-wrapper" {
	interface UpnpOptionsNoPort {
		protocol:		"TCP" | "UDP";
		description?:	string;
	}

	interface UpnpOptionsSinglePort extends UpnpOptionsNoPort {
		port:	number | [number, number];
	}

	interface UpnpOptionsMultiPort extends UpnpOptionsNoPort {
		ports:	number[];
	}

	type UpnpMapOptions = UpnpOptionsSinglePort | UpnpOptionsMultiPort;
	interface UpnpUnmapOptions extends Omit<UpnpMapOptions, "description"> {}

	interface result {
		success: boolean;
		err?: Error | string;
	}

	interface mapping {
		public:			{host: string, port: number};
		private:		{host: string, port: number};
		protocol:		string;
		enabled:		boolean;
		description:	string;
		ttl:			number;
	}

	export function map(opts: UpnpMapOptions):			Promise<result>;
	export function unmap(opts: UpnpUnmapOptions):		Promise<result>;
	export function mappings(local: boolean):
		Promise<{success: boolean,	results:	mapping[]} |
				{success: boolean,	err:		string}>;
	export function ip():
		Promise<{success: boolean,	ip:		string} |
				{success: boolean,	err:	string}>;
}
