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
	async retrieve(context, dc, logger) {
		const format = dc?.getOutputFormat() || 'OTHERS';
		if (format === 'JSON') {
			const data = await dc.getData();
			const fileBuffer = new Readable();
			fileBuffer.push(JSON.stringify(data));
			fileBuffer.push(null); //somehow null needs to be pushed or the api crashes.
			
			return {
				data: fileBuffer,
				headers: {
					'content-type': 'application/json'
				}
			};
		}
		else {
			let contentType;
			let extension;
			switch (format) {
				case 'PNG':
					contentType = 'image/png';
					extension = '.png';
					break;
				case 'JPEG':
				case 'JPG':
					contentType = 'image/jpeg';
					extension = '.jpg';
					break;
				default:
					// Preserve previous behavior for unknown formats.
					contentType = 'image/png';
					extension = '.png';
					break;
			}

			const __filename = fileURLToPath(import.meta.url);
			const __dirname = path.dirname(__filename);
			const filePath = path.join(__dirname, `../../../storage/testimage${extension}`);
			const fileBuffer = new Readable();
			const file = await fs.readFile(filePath);
			fileBuffer.push(file);
			fileBuffer.push(null);

			const response = {
				data: fileBuffer,
				headers: {
					'content-type': contentType
				}
			};

			return response;
		}
	}

};

export default GeeResults;
