import GeeProcess from '../processgraph/process.js';
import DataCube from '../datacube/datacube.js';

export default class load_collection extends GeeProcess {

	executeSync(node) {
		// Create a dummy DataCube result for testing
		//TODO: later to be replaced with a small example image from disk
		const dummyDataCube = new DataCube(null, null);
		dummyDataCube.setOutputFormat('JPEG');
		dummyDataCube.setData([1,2,3,4,5]);

		return dummyDataCube;
	}

}
