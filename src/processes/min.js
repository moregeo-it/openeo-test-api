import GeeProcess from '../processgraph/process.js';

export default class min extends GeeProcess {

	executeSync(node) {
		let x = node.getArgument("x", undefined);
		let y = node.getArgument("y", undefined);
		return Math.min(x,y);
	}

}
