export default class Processes {

	constructor(context) {
		this.registry = context.processes();
	}

	async beforeServerStart(server) {
		server.addEndpoint('get', '/processes', this.getProcesses.bind(this));

		const a = Date.now();
		const numPublic = await this.registry.addFromFolder('./src/processes/');
		const numPrivate = await this.registry.addFromFolder('./src/processes/private/');
		console.log(`Loaded ${num} processes (${Date.now()-a} ms)`);
		return numPublic + numPrivate;
	}

	async getProcesses(req, res) {
		const isAuthenticated = Boolean(req.user._id)

		res.json({
			processes: this.registry.namespace('backend'),
			links: []
		});
	}

}
