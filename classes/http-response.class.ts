import {HttpResponseMessage, JsonContent, StringContent} from "inversify-express-utils";
import {OutgoingHttpHeaders} from "http";

export class HttpResponse<T=any> extends HttpResponseMessage {
    constructor(content: T);
    constructor(content: T, headers: OutgoingHttpHeaders);
    constructor(content: T, headers: OutgoingHttpHeaders, status: number);
    constructor(content: T, headers: OutgoingHttpHeaders = {}, status: number = 200) {
        super(status);
        this.setContent(content);
        this.addHeaders(headers);
    }

    setStatusCode(statusCode:number){
        this.statusCode = statusCode;
        return this;
    }

    setContent(content: T | string, mediaType?: string) {
        const type = ["object"].indexOf(typeof content) === -1 ? "string" : "json";
        switch (type) {
            case "string":
                this.content = new StringContent(content as string, mediaType);
                break;
            case "json":
                this.content = new JsonContent(content as any, mediaType);
                break;
            default:
                break;
        }

        return this;
    }

    addSingleHeader(headerName: string, headerValue: any) {
        this.headers[headerName] = headerValue;
        return this;
    }

    addHeaders(headers:OutgoingHttpHeaders) {
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
     *  create response
     * @param content
     */
    static builder(content: any);

    /**
     * @inheritDoc
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     */
    static builder(content: any, headers: OutgoingHttpHeaders);
    /**
     *
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     * @param {number} status
     */
    static builder(content: any, headers: OutgoingHttpHeaders, status: number);
    /**
     * @inheritDoc
     * @param content
     * @param {"http".OutgoingHttpHeaders} headers
     * @param {number} status
     * @returns {HttpResponse}
     */
    static builder(content: any, headers?: OutgoingHttpHeaders, status: number = 200) {
        return new this(content, headers, status)
    }
}