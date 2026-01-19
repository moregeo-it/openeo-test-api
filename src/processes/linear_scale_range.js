import GeeProcess from '../processgraph/process.js';
import GeeProcessing from './utils/processing.js';
import clip from './clip.js';

export default class linear_scale_range extends GeeProcess {

  executeSync(node) {
    const inputMin = node.getArgument('inputMin');
    const inputMax = node.getArgument('inputMax');
    const outputMin = node.getArgument('outputMin', 0);
    const outputMax = node.getArgument('outputMax', 1);
    return GeeProcessing.applyUnaryNumericalFunction(node, data => {
      const clipped = clip.process(data, inputMin, inputMax);
      // Linear scale: ((x - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin
      const scaled = ((clipped - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
      return scaled;
    });
  }

}
