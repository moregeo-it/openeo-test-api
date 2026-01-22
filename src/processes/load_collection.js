import GeeProcess from '../processgraph/process.js';
import DataCube from '../datacube/datacube.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PNG from 'pngjs';

export default class load_collection extends GeeProcess {
	async loadTestImageFromFile() {
		const __filename = fileURLToPath(import.meta.url)
		const __dirname = path.dirname(__filename)
		// load testimage.png from disk
		const filePath = path.join(__dirname, '../../storage/testimage.png')
		const fileBuffer = fs.readFileSync(filePath);
		
		return new Promise((resolve, reject) => {
			const png = new PNG.PNG();
			png.parse(fileBuffer, (err, data) => {
				if (err) {
					reject(err);
				} else {
					// Convert PNG data to Array
					const pixelArray = Array.from(data.data);
					resolve(pixelArray);
				}
			});
		});
	}

	async executeSync(node) {
		const id = node.getArgument('id');

		let data
		data = await this.loadTestImageFromFile();
		
		const dc = new DataCube(data);

		return dc;
	}

}
