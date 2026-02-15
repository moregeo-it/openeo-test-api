import GeeProcess from '../processgraph/process.js';

export default class linear_scale_range extends GeeProcess {

  executeSync(node) {
    const inputMin = node.getArgument('inputMin');
    const inputMax = node.getArgument('inputMax');
    const outputMin = node.getArgument('outputMin', 0);
    const outputMax = node.getArgument('outputMax', 1);
    const data = node.getArgument('x');
    const clipped = Math.max(inputMin, Math.min(inputMax, data));
    // Linear scale: ((x - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin
    const scaled = ((clipped - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    return scaled;
  }

}
