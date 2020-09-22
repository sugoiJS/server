import {AfterHook, BeforeHook, Next, Request, RequestBody, Response} from "../../../decorators";
import {HTTP_METHOD} from "../../../constants/methods.constant";
import {DummyModel} from "../controllers/crud.controller";


export class Hooks {


    @BeforeHook('*', HTTP_METHOD.POST)
    beforeCrud(req, res, next) {
        DummyModel.hookChecker = req.body.id;
        console.log('Before Hook',req.body.id);
        console.log('Before Hook',req.route.method);
        next()
    }

    @AfterHook('*', HTTP_METHOD.GET)
    afterCrud(req,
              res,
              next) {
        delete DummyModel.hookChecker;
        console.log('After Hook',req.route.method);
        next()
    }
}