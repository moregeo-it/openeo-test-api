# openeo-test-api

Backend-less testing API, simulating an openEO backend. For testing purposes during openEO client development.

Based on the openEO backend driver for [Google Earth Engine](https://earthengine.google.com/): [openeo-earthengine-driver on GitHub](https://github.com/Open-EO/openeo-earthengine-driver).

This API implements **openEO API version 1.2.0**.

## Setting up an Instance

The driver is written in [Node.js](https://nodejs.org/) and requires a Node.js version between v20.0.0 and v23.11.1.
Install Node.js and npm according to the official documentation of each software package.

Afterwards, either download the files in this repository or clone it. Run `npm install` to install the dependencies.

### Configuration

There are several important configuration options in the file [config.json](config.json):

* `hostname`: The address of the server. For local deployments usually `127.0.0.1`, for public instances the IP or domain name of the server, e.g. `test.openeo.example`.
* `port`: The port the HTTP instance of the openEO GEE driver is running on.
* `ssl`: Configuration to enable HTTPS (secured HTTP with SSL).
  * `port`: The port the HTTPS (secured) instance of the openEO GEE driver is running on.
  * `key`: If you want to create an HTTPS server, pass in a private key. Otherwise set to `null`.
  * `certificate`: If you want to create an HTTPS server, pass in a PEM-encoded certificate. Otherwise set to `null`.

To disable certain endpoints, edit the following flags in the [config.json](config.json) file:
* Batch-Jobs `/jobs`: 
  * set `"batchJobsEndpoint": false`
* Synchronous processing `/result`:
  * set `"synchronousProcessing": false`
* Web-services `/services`: 
  * set `"webServicesEndpoint": false`
* Files `/files`: 
  * set `"filesEndpoint": false`
* User-defined process-graphs `/process_graphs`: 
  * set `"processGraphsEndpoint": false`
* [Processing-parameters extension](https://api.openeo.org/extensions/processing-parameters/0.1.0) `/processing_parameters`: 
  * set `"processingParameters": false`
* [UDF Framework](https://open-eo.github.io/openeo-udf/) `/udf_runtimes`
  * set `"userDefinedFunctions": false`
Any of these configuration options can be overridden using environment variables. For example:
```bash
WEBSERVICESENDPOINT=false PORT=8081 npm start
```

To use the bearer token format prior to openEO specification 1.3.0, edit the following flag in the [config.json](config.json) file:

* set `"legacyTokens": true`,
or start the api with the environment variable `legacytokens=true`.

This may be necessary for clients that don't yet support the 1.3.0 specification.

### Starting up the Server

After configuration, the API can be started. Run `npm start` to start the server.

#### User Management

To allow testing the full functionality of the API, it is recommended to set up user accounts before starting.

* Add a new user: `npm run adduser`
* Delete a user: `npm run deluser`
* List all users: `npm run users`

## Usage

In the testing suite of your choice you may connect the client to be tested to the API after starting the server using `npm start`. By default the endpoint will listen at `http://127.0.0.1:8080`

## Docker

Create the docker image using:

```sh
docker build -t openeo-test-api .
```

`docker-compose.yml` contains environment variables to define a test-user. Adjust these in accordance to your test definition.

Run the docker container using:

```sh
docker compose up
```

In the directory of the `docker-compose.yml` file.
To take down the docker container, run:

```sh
docker compose down
```
