import {ServerModule} from "../../index";
import {IndexController} from "./controllers/index.controller";
import {Sub1Module} from "./submodule/sub1/sub1.module";
import {AuthService} from "./services/auth.service";
import {Sub3Module} from "./submodule/sub3/sub3.module";

@ServerModule({
    controllers: [IndexController],
    services: [AuthService],
    modules: [Sub1Module]
})
export class Bootstrap {
}
