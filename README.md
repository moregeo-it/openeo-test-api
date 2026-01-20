# openeo-test-api

Backend-less testing API, simulating an openEO backend. For testing purposes during openEO client development. 

Based on the openEO backend driver for [Google Earth Engine](https://earthengine.google.com/): [openeo-earthengine-driver on GitHub](https://github.com/Open-EO/openeo-earthengine-driver).

This API implements **openEO API version 1.2.0**.

## Setting up an instance

The driver is written in [Node.js](https://nodejs.org/) and requires a Node.js version between v20.0.0 and v23.11.1.
Install Node.js and npm according to the official documentation of each software package.

Afterwards, either download the files in this repository or clone it. Run `npm install` to install the dependencies.

### Configuration

There are several important configuration options in the file [config.json](config.json):

* `hostname`: The address of the server running the openEO GEE driver. For local deployments usually `127.0.0.1`, for public instances the IP or domain name of the server, e.g. `earthengine.openeo.org`.
* `port`: The port the HTTP instance of the openEO GEE driver is running on.
* `ssl`: Configuration to enable HTTPS (secured HTTP with SSL).
    * `port`: The port the HTTPS (secured) instance of the openEO GEE driver is running on.
    * `key`: If you want to create an HTTPS server, pass in a private key. Otherwise set to `null`.
    * `certificate`: If you want to create an HTTPS server, pass in a PEM-encoded certificate. Otherwise set to `null`.

### Starting up the server

After configuration, the API can be started. Run `npm start` to start the server.

#### User management

To allow testing the full functionality of the API, it is recommended to set up user accounts before starting.

- Add a new user: `npm run adduser`
- Delete a user: `npm run deluser`
- List all users: `npm run users`

## Usage

In the testing suite of your choice you may connect the client to be tested to the API after starting the server using `npm start`. By default the endpoint will listen at `http://127.0.0.1:8080`
