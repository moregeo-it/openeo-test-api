import JpegFormat from "../formats/jpeg.js";
import JsonFormat from "../formats/json.js";
import PngFormat from "../formats/png.js";
import Utils from "./utils.js";

export default class Config {

	constructor() {
<<<<<<< HEAD
		this.environmentVariables = {
			"debug": Boolean,
			"production": Boolean,
			"hostname": String,
			"apiPath": String,
			"apiVersion": String,
			"legacyTokens": Boolean,
			"id": String,
			"title": String,
			"description": String,
			"port": Number,
			"exposePort": Number,
			"defaultLogLevel": String,
			"stacAssedDownloadSize": Number
		}	
=======
		this.environmentVariableNames = [
			"debug",
			"production",
			"hostname",
			"apiPath",
			"apiVersion",
			"legacyTokens",
			"id",
			"title",
			"description",
			"port",
			"exposePort",
			"defaultLogLevel",
			"stacAssedDownloadSize"
		]	
>>>>>>> 4270d27 (improve environmentVariable checking)

		// Set default that can be overriden by the config.json
		this.debug = false;
		this.production = false;

		this.hostname = "127.0.0.1";
		this.apiPath = "/";
		this.apiVersion = "1.2.0";
		this.legacyTokens = false;

		this.id = "openeo-test-api";
		this.title = "Test API";
		this.description = "This is a test API for openEO.";

		this.port = 80;
		this.exposePort = null;
		this.ssl = {
			port: 443,
			exposePort: null,
			key: null,
			certificate: null
		};

		this.serviceAccountCredentialsFile = null;
		this.authClients = [];

		this.currency = null;
		this.plans = {
			default: null,
			options: []
		};


		this.inputFormats = {};
		this.outputFormats = {
			PNG: new PngFormat(),
			JPEG: new JpegFormat(),
			JSON: new JsonFormat()
		};

		this.services = {
			xyz: {
				title: "XYZ (Slippy Map Tilenames)",
				description: "XYZ tiles for web mapping libraries such as OpenLayers or LeafLet.\n\nAlways rendered in Web Mercator (EPSG code 3857), other reference systems specified are ignored.",
				configuration: {},
				process_parameters: []
			}
		};

		this.otherVersions = [];
		// Example to add: {url: 'http://xyz.de', production: false, version: '1.0.0'}

		// Path to check disk usage for (e.g. C: on Windows, / on *nix)
		this.diskUsagePath = null;

		this.defaultLogLevel = "info";
		this.stacAssetDownloadSize = 2000; // > 0 and <= 2000

		const config = Utils.require('../../config.json');
		for(const c in config) {
			this[c] = config[c];
		}

		// look for environment variables
		for(const c in this.environmentVariables) {
			if (process.env[c] != undefined || process.env[c.toUpperCase()] != undefined ){
				let variable = process.env[c] || process.env[c.toUpperCase()]
				switch(this.environmentVariables[c]){
					case String:
						break;
					case Boolean:
						variable = (variable.toLowerCase() === 'true');
						break;
					case Number:
						variable = Number.parseFloat(variable)
						break;
				}
				this[c] = variable
			}
		}

		this.ssl.exposePort = this.ssl.exposePort || this.ssl.port;
		this.exposePort = this.exposePort || this.port;
	}

}
