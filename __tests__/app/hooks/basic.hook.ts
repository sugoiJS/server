import {AfterHook, BeforeHook, Next, Request, RequestBody, Response} from "../../../decorators";
import {HTTP_METHOD} from "../../../constants/methods.constant";
import {DummyModel} from "../controllers/crud.controller";


export class Hooks {


    @BeforeHook('base/bootstrap2/HookChecker', HTTP_METHOD.POST)
    beforeCrud(req, res, next) {
        try{
        DummyModel['hookChecker'] = req.body.id;
        }catch(e){}
        next()
    }

    @AfterHook('base/bootstrap2/HookChecker', HTTP_METHOD.GET)
    afterCrud(req,
              res,
              next) {
        delete DummyModel['hookChecker'];
        next()
    }
}