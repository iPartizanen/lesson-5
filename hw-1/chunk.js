const { validateCustomer } = require('./customer');

const chunkAttributes = ['meta', 'payload'];

const validateChunk = data => {
    const { meta, payload } = data;

    if (typeof meta !== 'object' || !meta) {
        throw new TypeError('Meta property must be non-empty object!');
    }

    if (typeof payload !== 'object' || !payload) {
        throw new TypeError('Payload property must be non-empty object!');
    }

    for (key in data) {
        if (!chunkAttributes.includes(key)) {
            throw new Error(`Chunk contains non-allowed property '${key}'!`);
        }
    }

    const { source } = meta;

    if (typeof source !== 'string' || !source) {
        throw new TypeError('Meta.source must be non-empty string!');
    }

    for (key in meta) {
        if (key !== 'source') {
            throw new Error(`Meta contains non-allowed property '${key}'!`);
        }
    }

    validateCustomer(payload);

    return 0;
};

module.exports = { validateChunk };
