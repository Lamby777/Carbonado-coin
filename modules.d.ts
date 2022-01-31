declare module "nat-api" {
	export default class NatAPI {
		map(port: number | Object, callback: Function): Promise<Error>;
	}
}

declare module "nat-pmp" {
	export function connect(gatewayIp: string): any;
}
