import GeeProcess from '../processgraph/process.js';

export default class sum extends GeeProcess {

	executeSync(node) {
		let data = node.getArgument("data", undefined);
		if (Array.isArray(data) || (data = [data])) {
			// sum all elements in array
			return data.reduce((acc, val) => acc + val, 0);
		}
		// single value
		else return data;
	}

}
