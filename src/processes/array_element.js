import GeeProcess from '../processgraph/process.js';

export default class array_element extends GeeProcess {

  executeSync(node) {
    let data = node.getArgument("data", undefined);
    let index = node.getArgument("index", undefined);
    
    // Return the element at the specified index
    if (Array.isArray(data) && index !== undefined) {
      return data[index];
    }
    
    // If not an array or no index, return undefined
    return undefined;
  }
}
