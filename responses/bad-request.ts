import {HttpResponse} from "../classes/http-response.class";

export const BadRequest = (content: string | { [prop: string]: any }, headers: { [prop: string]: any } = {}) => {
    return HttpResponse.builder(content, headers, 400)
};