export default class EEDummy {
	constructor() {
		this.data = {
			authenticateViaPrivateKey: this.authenticateViaPrivateKey
		}
	}

	initialize() {
		return
	}

	authenticateViaPrivateKey(privateKey, opt_success, opt_error, opt_extraScopes,
		opt_suppressDefaultScopes) {
			console.log("EEDummy authenticated with private key.");
			if (opt_success) {
				opt_success()
			} else {
				opt_error("No success callback provided.");
			}
		}

}