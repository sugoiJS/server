import {ServerModule} from "../../../../decorators/server-module.decorator";
import {Bootstrap2Service} from "./bootstrap-2.service";
import {Bootstrap2Controller} from "./bootstrap-2.controller";
import {CrudController, DummyModel} from "../../controllers/crud.controller";
import {CRUDControllerFactory} from "../../../../classes/crud-controller.class";


@ServerModule({
    controllers: [
        Bootstrap2Controller,
        CrudController,
        CRUDControllerFactory.of<DummyModel>(DummyModel)
    ],
    services: [Bootstrap2Service]
})
export class Bootstrap2Module {
    constructor() {
    };
}