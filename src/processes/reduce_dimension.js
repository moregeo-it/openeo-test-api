import GeeProcess from '../processgraph/process.js';

export default class reduce_dimension extends GeeProcess {

	executeSync(node) {
		let data = node.getArgument("data", undefined);
		let reducer = node.getArgument("reducer", undefined);
		
		// If no reducer function is provided, return the data as-is
		if (!reducer) {
			return data;
		}
		
		// If data is an array, apply the reducer across all elements
		if (Array.isArray(data)) {
			return data.reduce((acc, val) => reducer(acc, val));
		}
		
		// If single value, return it
		return data;
	}

}
