import GeeProcess from '../processgraph/process.js';

export default class add extends GeeProcess {

	executeSync(node) {
		let x = node.getArgument("x", undefined);
		let y = node.getArgument("y", undefined);
		return x + y;
	}
}
