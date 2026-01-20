import Utils from "../utils/utils.js";
import FileFormat, { EPSGCODE_PARAMETER, SIZE_PARAMETER } from "./fileformat.js";

export const EPSGCODE_PARAMETER_BITMAP = Object.assign({}, EPSGCODE_PARAMETER);
EPSGCODE_PARAMETER_BITMAP.default = 4326;
EPSGCODE_PARAMETER_BITMAP.description += 'Defaults to WGS 84 (EPSG Code 4326).';

const VISUALIZATION_PARAMETER = {
  collectionRenderer: {
    description: "For image collections (time series) a specific method combine the images into a single image can be chosen.",
    type: "string",
    enum: ["filmstrip", "mosaic"],
    default: "mosaic",
    optional: true
  },
  bands: {
    description: "Band selection for visualization",
    oneOf: [
      {
        title: "Grayscale",
        description: "Band selection a single band visualization",
        type: "object",
        required: [
          "gray"
        ],
        properties: {
          gray: {
            type: 'string',
            subtype: 'band-name',
            description: 'Band name being used for the grayscale channel.'
          }
        },
        additionalProperties: false
      },
      {
        title: "RGB",
        description: "Band selection a three band RGB visualization",
        type: "object",
        required: [
          "red",
          "green",
          "blue"
        ],
        properties: {
          red: {
            type: 'string',
            subtype: 'band-name',
            description: 'Band name being used as a red channel.'
          },
          green: {
            type: 'string',
            subtype: 'band-name',
            description: 'Band name being used for the green channel.'
          },
          blue: {
            type: 'string',
            subtype: 'band-name',
            description: 'Band name being used for the blue channel.'
          },
        },
        additionalProperties: false
      }
    ],
    default: null,
    optional: true
  },
  palette: {
    type: 'array',
    description: 'List of hex RGB colors used as palette for visualization, e.g. `#ffffff` for white.',
    default: null
  }
};

export default class BitmapLike extends FileFormat {

  constructor(title, description = '') {
    super(title, {}, description);
    this.addParameter('epsgCode', EPSGCODE_PARAMETER_BITMAP);
    this.addParameter('size', SIZE_PARAMETER);
    this.addParameters(VISUALIZATION_PARAMETER);
  }

  getGisDataTypes() {
    return ['raster'];
  }

  getFormatCode() {
    return null;
  }

  allowMultiple(parameters) {
    const renderer = parameters.collectionRenderer || 'mosaic';
    return renderer === 'filmstrip';
  }

  async retrieve(ee, dc) {
		const parameters = dc.getOutputFormatParameters();
    const img = dc.getData();

		let region = null;
		let crs = null;
		if (dc.hasXY()) {
			region = Utils.bboxToGeoJson(dc.getSpatialExtent());
			crs = Utils.crsToString(dc.getCrs());
		}

    const eeOpts = {
      format: this.getFormatCode(),
      dimensions: parameters.size || 1000,
      region,
      crs
    };
    const urlFunc = (img instanceof ee.ImageCollection) ? 'getFilmstripThumbURL' : 'getThumbURL';
    return await new Promise((resolve, reject) => {
      img[urlFunc](eeOpts, (url, err) => {
        if (err) {
          reject(err);
        }
        else if (typeof url !== 'string' || url.length === 0) {
          reject('Download URL provided by Google Earth Engine is empty.');
        }
        else {
          resolve(url);
        }
      });
    });
  }

}
