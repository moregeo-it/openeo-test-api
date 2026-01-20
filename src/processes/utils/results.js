import { Readable } from 'stream';

const GeeResults = {
	getFileExtension(dc, config) {
		const format = dc.getOutputFormat();
		const parameters = dc.getOutputFormatParameters();
		const formatSpec = config.outputFormats[format];
		let ext;
		if (formatSpec) {
			ext = formatSpec.getFileExtension(parameters);
		}
		return ext || '';
	},

	// Returns AxiosResponse (object) or URL (string)
	async retrieve() {
		const dummyStream = new Readable();
		dummyStream.push(Buffer.from('dummy image data for testing'));
		dummyStream.push(null);
		
		const response = {
			data: dummyStream,
			headers: {
				'content-type': 'image/jpeg'
			}
		};

		return response;
	}

};

export default GeeResults;
