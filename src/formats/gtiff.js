import FileFormat, { EPSGCODE_PARAMETER, SCALE_PARAMETER } from "./fileformat.js";

export default class GTiffFormat extends FileFormat {
  constructor(title = 'GeoTiff', parameters = {}) {
    super(title, parameters);
    this.addParameter('scale', SCALE_PARAMETER);
    this.addParameter('epsgCode', EPSGCODE_PARAMETER);
    this.addParameter('zipped', {
      type: 'boolean',
      description: 'Pack the GeoTiff files into ZIP files, one file per band.',
      default: false
    });
  }

  getGisDataTypes() {
    return ['raster'];
  }

  getFileExtension(parameters) {
    return parameters.zipped ? '.zip' : '.tiff';
  }
  
  async retrieve(dc) {
		return true;
  }

}
