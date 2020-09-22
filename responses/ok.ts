import {HttpResponse} from "../classes/http-response.class";

export const Ok = (content: string | { [prop: string]: any }, headers: { [prop: string]: any } = {}) => {
    return HttpResponse.builder(content, headers, 200)
};