import GeeProcess from '../processgraph/process.js';

export default class clip extends GeeProcess {

  executeSync(node) {
    const min = node.getArgument('min');
    const max = node.getArgument('max');
    const data = node.getArgument('x');
    return Math.max(min, Math.min(max, data));
  }

}
