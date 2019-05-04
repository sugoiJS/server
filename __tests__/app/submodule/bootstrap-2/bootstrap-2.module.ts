import {ServerModule} from "../../../../decorators/server-module.decorator";
import {Bootstrap2Service} from "./bootstrap-2.service";
import {Bootstrap2Controller} from "./bootstrap-2.controller";
import {CrudController, DummyModel, DummyModelExtended} from "../../controllers/crud.controller";
import {CRUDControllerFactory} from "../../../../classes/crud-controller.class";
import {HTTP_METHOD} from "../../../../constants/methods.constant";


@ServerModule({
    controllers: [
        Bootstrap2Controller,
        CrudController,
        CRUDControllerFactory.of<DummyModel>(DummyModel),
        CRUDControllerFactory.of<DummyModelExtended>(DummyModelExtended)
            .setAllowedMethods(HTTP_METHOD.GET,HTTP_METHOD.POST,HTTP_METHOD.PUT)
    ],
    services: [Bootstrap2Service]
})
export class Bootstrap2Module {
    constructor() {
    };
}