import processingParametersList from '../models/processingParams.js';

export default class ProcessingParametersAPI {
    constructor(context) {
        this.context = context;
    }

    beforeServerStart(server) {
        server.addEndpoint('get', '/processing_parameters', this.listProcessingParameters.bind(this));
        return Promise.resolve();
    }

    async listProcessingParameters(req, res) {
        // for now return hardcoded processing parameters
        res.json({
            "create_job_parameters": processingParametersList,
            "create_synchronous_parameters": processingParametersList
        });
    }
}
