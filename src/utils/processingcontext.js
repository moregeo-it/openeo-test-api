import Utils from './utils.js';
import fse from 'fs-extra';

export default class ProcessingContext {

	constructor(serverContext, user = null) {
		this.serverContext = serverContext;
		this.user = user;
		this.userId = user ? user._id : null;
		this.ee = null;
		this.eePrivateKey = null;
	}

	async connectGee(forcePrivateKey = false) {
		// GEE integration removed - this method is no longer functional
		console.warn("connectGee() called but GEE integration has been removed");
		return null;
	}

	server() {
		return this.serverContext;
	}

	getCollection(id) {
		return this.serverContext.collections().getData(id);
	}

	getStoredProcessGraph(id) { // returns promise
		return this.serverContext.storedProcessGraphs().getById(id);
	}

	getJob(jobId) { // returns promise
		return this.serverContext.jobs().getById(jobId);
	}

	getVariable(id) {
		return this.variables[id];
	}

	setUserId(userId) {
		this.userId = userId;
	}

	getUserId() {
		return this.userId;
	}

	getUser() {
		return this.user;
	}

}
