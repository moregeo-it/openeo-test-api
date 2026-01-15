import Utils from './utils.js';
import fse from 'fs-extra';
import EEDummy from './eedummy.js';

export default class ProcessingContext {

	constructor(serverContext, user = null) {
		this.serverContext = serverContext;
		this.user = user;
		this.userId = user ? user._id : null;
		this.ee = new EEDummy();
		this.eePrivateKey = null;
	}

	async connectGee(forcePrivateKey = false) {
		//TODO: entire class could be redundant
		const user = this.getUser();
		const ee = this.ee;
		if (!forcePrivateKey && typeof this.userId === 'string' && this.userId.startsWith("google-")) {
			console.log("Authenticate via user token");
			const expires = 59 * 60;
			// todo auth: get expiration from token and set more parameters #82
			ee.apiclient.setAuthToken(null, 'Bearer', user.token, expires, [], null, false, false);
		}
		console.log("Authenticate via private key");
		await new Promise((resolve, reject) => {
			ee.data.authenticateViaPrivateKey(
				null,
				() => resolve(),
				error => reject("ERROR: GEE Authentication failed: " + error.message)
			);
		});

		await ee.initialize();
		return ee;
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
