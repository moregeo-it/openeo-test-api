import GeeProcess from '../processgraph/process.js';

export default class clip extends GeeProcess {

  static process(data, min, max) {
    // Helper function to clamp a value between min and max
    const clamp = (value) => {
      if (Array.isArray(value)) {
        return value.map(v => clamp(v));
      }
      return Math.max(min, Math.min(max, value));
    };
    return clamp(data);
  }

  executeSync(node) {
    const min = node.getArgument('min');
    const max = node.getArgument('max');
    const data = node.getArgument('x');
    return this.process(data, min, max)
  }

}
