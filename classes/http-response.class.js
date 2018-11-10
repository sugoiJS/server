"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
class HttpResponse extends inversify_express_utils_1.HttpResponseMessage {
    constructor(content, headers = {}, status = 200) {
        super(status);
        this.setContent(content);
        this.addHeaders(headers);
    }
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
    setContent(content, mediaType) {
        const type = ["object"].indexOf(typeof content) === -1 ? "string" : "json";
        switch (type) {
            case "string":
                this.content = new inversify_express_utils_1.StringContent(content, mediaType);
                break;
            case "json":
                this.content = new inversify_express_utils_1.JsonContent(content, mediaType);
                break;
            default:
                break;
        }
        return this;
    }
    addSingleHeader(headerName, headerValue) {
        this.headers[headerName] = headerValue;
        return this;
    }
    addHeaders(headers) {
        Object.assign(this.headers, headers);
        return this;
    }
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }
    removeHeader(headerName) {
        delete this.headers[headerName];
        return this;
    }
    /**
     * @inheritDoc
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     * @param {number} status
     * @returns {HttpResponse}
     */
    static builder(content, headers, status = 200) {
        return new this(content, headers, status);
    }
}
exports.HttpResponse = HttpResponse;
