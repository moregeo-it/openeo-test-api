import HttpUtils from '../utils/http.js';
import StringStream from '../utils/stringstream.js';
import FileFormat from './fileformat.js';
import Errors from '../utils/errors.js';

export default class JsonFormat extends FileFormat {
  constructor() {
    super('JSON');
  }

  getFileExtension(/*parameters*/) {
    return '.json';
  }

  getGisDataTypes() {
    return ['vector', 'table', 'other'];
  }

  async retrieve(dc) {
    let data = dc.getData();
    if (typeof data === 'undefined' || data === null) {
      throw new Errors.DataCubeEmpty();
    }
    const stream = new StringStream(JSON.stringify(data));
    return HttpUtils.createResponse(stream, {'content-type': 'application/json'});
  }

}
