import {ServerModule} from "../../index";
import {IndexController} from "./controllers/index.controller";
import {Sub1Module} from "./submodule/sub1/sub1.module";
import {AuthService} from "./services/auth.service";
import {TestService} from "./services/test.service";
import {CRUDControllerFactory} from "../../classes/crud-controller.class";
import {CrudTest} from "./models/crud-test.model";

@ServerModule({
    controllers: [
        IndexController,
        CRUDControllerFactory.of(CrudTest,{endpoint: '/CrudTesting', authorized: true, roles: [2,4,6] })
    ],
    services: [
        {
            provide: new TestService().setNumber(5),
            useName: "TestInstance"
        },
        {
            provide: ()=>new TestService().setNumber(Math.random()),
            useName: "TestFactory"
        },
        {
            provide: TestService,
            useName: "TestServiceName"
        },
        AuthService
    ],
    modules: [Sub1Module]
})
export class Bootstrap {


}
