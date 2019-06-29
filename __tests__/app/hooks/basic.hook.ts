import {AfterHook, BeforeHook, Next, Request, RequestBody, Response} from "../../../decorators";
import {HTTP_METHOD} from "../../../constants/methods.constant";
import {DummyModel} from "../controllers/crud.controller";


export class Hooks {


    @BeforeHook('*', HTTP_METHOD.POST)
    beforeCrud(req, res, next) {
        DummyModel['hookChecker'] = req.body.id;
        next()
    }

    @AfterHook('*', HTTP_METHOD.GET)
    afterCrud(req,
              res,
              next) {
        delete DummyModel['hookChecker'];
        next()
    }
}