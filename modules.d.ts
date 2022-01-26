declare module "freedom-port-control" {
	export function probeProtocolSupport(): {
		"natPmp":	boolean,
		"pcp":		boolean,
		"upnp":		boolean,
	}

	export function addMapping(internal: number, external: number, life: number): void;
}