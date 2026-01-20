import { fileURLToPath } from 'url';
import { promises as fs } from "fs";
import path from 'path';
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
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const filePath = path.join(__dirname, '../../../storage/testimage.png');
		const fileBuffer = new Readable();
		const file = await fs.readFile(filePath);
		fileBuffer.push(file);
		fileBuffer.push(null);

		const response = {
			data: fileBuffer,
			headers: {
				'content-type': 'image/png'
			}
		};

		return response;
	}

};

export default GeeResults;
