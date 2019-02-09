"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_response_class_1 = require("../classes/http-response.class");
exports.NotFound = (content, headers = {}) => {
    return http_response_class_1.HttpResponse.builder(content, headers, 404);
};
