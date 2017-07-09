'use strict';
const _ = require('lodash');
const joi = require('joi');

module.exports = {
    schema: {
        // Describe the attributes with joi here
        coords: joi.array().items({
            lat: joi.number().required(),
            lng: joi.number().required(),
            alt: joi.number().default(0).optional()
        }).required(),
        data: joi.array().items({
            name: joi.string().required(),
            highway: joi.string().required(),
            geometryType: joi.string().required(),
            avgSpeed: joi.string().optional()
        }).required(),
        dataSrc: joi.object().optional()
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
