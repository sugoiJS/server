/// <reference types="node" />
import { HttpResponseMessage } from "inversify-express-utils";
import { OutgoingHttpHeaders } from "http";
export declare class HttpResponse<T = any> extends HttpResponseMessage {
    constructor(content: T);
    constructor(content: T, headers: OutgoingHttpHeaders);
    constructor(content: T, headers: OutgoingHttpHeaders, status: number);
    setStatusCode(statusCode: number): this;
    setContent(content: T | string, mediaType?: string): this;
    addSingleHeader(headerName: string, headerValue: any): this;
    addHeaders(headers: OutgoingHttpHeaders): this;
    setHeaders(headers: any): this;
    removeHeader(headerName: any): this;
    /**
     *  create response
     * @param content
     */
    static builder(content: any): any;
    /**
     * @inheritDoc
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     */
    static builder(content: any, headers: OutgoingHttpHeaders): any;
    /**
     *
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     * @param {number} status
     */
    static builder(content: any, headers: OutgoingHttpHeaders, status: number): any;
}
