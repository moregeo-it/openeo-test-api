import GeeProcess from '../processgraph/process.js';

export default class normalized_difference extends GeeProcess {

	executeSync(node) {
        let x = node.getArgument("x", undefined);
		let y = node.getArgument("y", undefined);
        return (x - y) / (x + y);
	}

}