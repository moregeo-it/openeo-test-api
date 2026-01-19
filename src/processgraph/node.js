import DataCube from '../datacube/datacube.js';
import { ProcessGraphNode } from '@openeo/js-processgraphs';
import Errors from '../utils/errors.js';
import ProcessGraph from '../processgraph/processgraph.js';
import GeeTypes from '../processes/utils/types.js';

export default class GeeProcessGraphNode extends ProcessGraphNode {

	constructor(json, id, parent) {
		super(json, id, parent);
	}

	get ee() {
		throw new Errors.Internal({
		message: 'Google Earth Engine (GEE) integration has been removed from this project. GEE-dependent operations are no longer available.'
		});
	}

	getLogger() {
		return this.processGraph.getLogger() || console; // If no logger is set, use console.xxx
	}

	getLoggerPath() {
		const path = [];
		let node = this;
		do {
			path.push(node.id);
			node = node.getParent();
		} while(node);
		return path.reverse();
	}

	debug(message, data = null) {
		this.getLogger().debug(message, data, this.getLoggerPath());
	}

	info(message, data = null) {
		this.getLogger().info(message, data, this.getLoggerPath());
	}

	warn(message, data = null) {
		this.getLogger().warn(message, data, this.getLoggerPath());
	}

	error(error, data = null, code = undefined, links = undefined) {
		this.getLogger().error(error, data, this.getLoggerPath(), code, links);
	}

	getContext() {
		return this.processGraph.getContext();
	}

	getServerContext() {
		return this.getContext().server();
	}

	getParameter(name) {
		return this.processGraph.getArgument(name);
	}

	isDataCube(name) {
		return this.getParameter(name) instanceof DataCube;
	}

	getDataCube(name, defaultValue = undefined) {
		return new DataCube(null, this.getArgument(name, defaultValue));
	}

	getCallback(name) {
		const callback = this.getArgument(name);
		if (!(callback instanceof ProcessGraph)) {
			throw this.invalidArgument('process', 'No process specified.');
		}
		return callback;
	}

	getArgument(name, defaultValue = undefined) {
		const constraint = this.getProcessGraph().getAdditionalConstraint(this.process_id, name);
		if (typeof constraint !== 'undefined') {
			return constraint;
		}
		return super.getArgument(name, defaultValue);
	}

	getExecutionContext() {
		return this.getProcessGraph().getArgument("executionContext");
	}

	invalidArgument(parameter, reason) {
		return new Errors.ProcessParameterInvalid({
			process: this.process_id,
			namespace: this.namespace || 'n/a',
			parameter,
			reason
		});
	}

}
