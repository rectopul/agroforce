"use strict";
exports.__esModule = true;
exports.importService = void 0;
var config_1 = require("next/config");
var helpers_1 = require("../helpers");
var publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
var baseUrl = publicRuntimeConfig.apiUrl + "/import";
function create(data) {
    return helpers_1.fetchWrapper.post(baseUrl, data);
}
function update(data) {
    return helpers_1.fetchWrapper.put(baseUrl, data);
}
function getAll(parameters) {
    return helpers_1.fetchWrapper.get(baseUrl, parameters);
}
function validate(data) {
    return helpers_1.fetchWrapper.post(baseUrl + "/validate", data);
}
function validateProtocol(data) {
    return helpers_1.fetchWrapper.post(baseUrl + "/validateProtocol", data);
}
exports.importService = {
    getAll: getAll,
    create: create,
    update: update,
    validate: validate,
    validateProtocol: validateProtocol
};
