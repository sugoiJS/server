import {HttpResponse} from "../classes/http-response.class";

export const ServerError = (content: string | { [prop: string]: any }, headers: { [prop: string]: any } = {}) => {
    return HttpResponse.builder(content, headers, 500)
};