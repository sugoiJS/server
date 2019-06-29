import {BeforeHook, Next, RequestBody} from "../../../decorators";
import {HTTP_METHOD} from "../../../constants/methods.constant";


class Hooks {


    @BeforeHook('*', HTTP_METHOD.POST)
    beforeCrud(@RequestBody() body: any, @Next() next) {
        body.timestamp = new Date().getTime()
        next();
    }

    @BeforeHook('*', HTTP_METHOD.GET)
    afterCrud(req, res, next) {

        next()
    }
}