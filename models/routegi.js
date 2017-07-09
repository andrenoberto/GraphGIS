'use strict';
const _ = require('lodash');
const joi = require('joi');

module.exports = {
    schema: {
        // Describe the attributes with joi here
        coords: joi.array().items({
            lat: joi.number().required(),
            lng: joi.number().required(),
            alt: joi.number.default(0).optional()
        }),
        data: joi.array().items({
            name: joi.string().required(),
            highway: joi.string().required(),
            geometryType: joi.string().required(),
            speed: joi.string().optional()
        }),
        dataSrc: joi.object().required()
    },
    forClient(obj) {
        // Implement outgoing transformations here
        obj = _.omit(obj, ['_id', '_rev', '_oldRev']);
        return obj;
    },
    fromClient(obj) {
        // Implement incoming transformations here
        return obj;
    }
};
