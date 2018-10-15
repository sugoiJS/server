import {ServerModule} from "../../index";
import {IndexController} from "./controllers/index.controller";
import {Sub1Module} from "./submodule/sub1/sub1.module";
import {AuthService} from "./services/auth.service";

@ServerModule({
    controllers: [IndexController],
    services: [AuthService],
    modules: [Sub1Module]
})
export class Bootstrap {
}
