import {ServerModule} from "../../../../decorators/server-module.decorator";
import {Bootstrap2Service} from "./bootstrap-2.service";
import {Bootstrap2Controller} from "./bootstrap-2.controller";

@ServerModule({
    controllers: [Bootstrap2Controller],
    services: [Bootstrap2Service]
})
export class Bootstrap2Module{

}