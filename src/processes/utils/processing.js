const GeeProcessing = {

	BAND_PLACEHOLDER: "#",

	evaluate(obj) {
		return new Promise((resolve, reject) => {
			return obj.evaluate((success, failure) => {
				if (success) {
					return resolve(success);
				} else {
					return reject(failure);
				}
			});
		});
	},

	/**
	 * Apply a binary numerical function to two numeric values/arrays.
	 * Works with standard JS data types instead of GEE objects.
	 */
	applyBinaryNumericalFunction(node, func, xParameter = "x", yParameter = "y", xDefault = undefined, yDefault = undefined) {
		let x = node.getArgument(xParameter, xDefault);
		let y = node.getArgument(yParameter, yDefault);

		// Helper function to apply operation element-wise
		const applyFunc = (a, b) => {
			// Both are numbers
			if (typeof a === 'number' && typeof b === 'number') {
				return func(a, b);
			}
			// Both are arrays
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) {
					throw node.invalidArgument(yParameter, "Arrays must have the same length");
				}
				return a.map((val, i) => applyFunc(val, b[i]));
			}
			// One is number, one is array
			if (typeof a === 'number' && Array.isArray(b)) {
				return b.map(val => applyFunc(a, val));
			}
			if (Array.isArray(a) && typeof b === 'number') {
				return a.map(val => applyFunc(val, b));
			}
			throw node.invalidArgument(yParameter, "Unsupported data type combination");
		};

		return applyFunc(x, y);
	},

	/**
	 * Apply a unary numerical function to numeric values/arrays.
	 * Works with standard JS data types instead of GEE objects.
	 */
	applyUnaryNumericalFunction(node, func, dataParameter = "x") {
		const data = node.getArgument(dataParameter);
		
		const applyFunc = (value) => {
			if (typeof value === 'number') {
				return func(value);
			}
			if (Array.isArray(value)) {
				return value.map(v => applyFunc(v));
			}
			throw node.invalidArgument(dataParameter, "Unsupported data type");
		};

		return applyFunc(data);
	},

	/**
	 * Reduce numerical data using a reducer function.
	 * Works with standard JS data types instead of GEE objects.
	 */
	reduceNumericalFunction(node, reducerSpec, binaryFunc = null, dataParameter = "data") {
		let reducerName;
		if (Array.isArray(reducerSpec)) {
			reducerName = reducerSpec[0];
		}
		else {
			reducerName = reducerSpec;
		}

		let data = node.getArgument(dataParameter);

		// If data is not an array, wrap it
		if (!Array.isArray(data)) {
			data = [data];
		}

		// Apply the appropriate reducer
		let result;
		switch (reducerName.toLowerCase()) {
			case 'sum':
				result = data.reduce((a, b) => a + b, 0);
				break;
			case 'min': {
				result = Math.min(...data);
				break;
			}
			case 'max': {
				result = Math.max(...data);
				break;
			}
			case 'mean':
			case 'avg':
			case 'average': {
				result = data.reduce((a, b) => a + b, 0) / data.length;
				break;
			}
			case 'count':
				result = data.length;
				break;
			case 'median': {
				const sorted = [...data].sort((a, b) => a - b);
				const mid = Math.floor(sorted.length / 2);
				result = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
				break;
			}
			case 'stddev':
			case 'std': {
				const mean = data.reduce((a, b) => a + b, 0) / data.length;
				const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
				result = Math.sqrt(variance);
				break;
			}
			default:
				// Try to use binaryFunc if provided
				if (binaryFunc && data.length > 0) {
					result = data.reduce((a, b) => binaryFunc(a, b));
				} else {
					throw node.invalidArgument(dataParameter, `Unsupported reducer: ${reducerName}`);
				}
		}

		return result;
	}

};

export default GeeProcessing;
