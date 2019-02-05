import {ServerModule} from "../../index";
import {IndexController} from "./controllers/index.controller";
import {Sub1Module} from "./submodule/sub1/sub1.module";
import {AuthService} from "./services/auth.service";
import {Sub3Module} from "./submodule/sub3/sub3.module";
import {TestService} from "./services/test.service";

@ServerModule({
    controllers: [IndexController],
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
