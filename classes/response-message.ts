export class ResponseMessage {
    constructor(public message: string,
                public data: any = null,
                public timestamp = new Date()) {
    }
}
