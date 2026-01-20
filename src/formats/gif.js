import Utils from "../utils/utils.js";
import BitmapLike from "./bitmap.js";

export default class GifFormat extends BitmapLike {
  constructor() {
    super('GIF (animated)', 'Either animated or static.');
    this.removeParameter('collectionRenderer');
    this.addParameter('framesPerSecond', {
      type: 'number',
      description: 'Number of images that are shown per second.',
      default: 1,
      optional: true,
      exclusiveMinimum: 0
    });
  }

  getFileExtension(/*parameters*/) {
    return '.gif';
  }

  getFormatCode() {
    return 'gif';
  }

  allowMultiple() {
    return true;
  }

  async retrieve(dc) {
    return true;
  }

}
