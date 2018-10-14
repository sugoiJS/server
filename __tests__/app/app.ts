import {ServerModule} from "../../index";
import {IndexController} from "./controllers/index.controller";

@ServerModule({
    controllers: [IndexController],
    services: []
})
export class Bootstrap {
}
