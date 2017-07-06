'use strict';
const _ = require('lodash');
const joi = require('joi');

module.exports = {
    schema: {
        // Describe the attributes with joi here
        coor: joi.array().items({
            lat: joi.string().required(),
            long: joi.string().required()
        }),
        data: joi.array().items({
            name: joi.string().required(),
            highway: joi.string(),
            geometryType: joi.string(),
            velocity: joi.string()
        })
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
