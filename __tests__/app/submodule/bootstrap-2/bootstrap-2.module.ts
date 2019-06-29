import {ServerModule} from "../../../../decorators";
import {Bootstrap2Service} from "./bootstrap-2.service";
import {Bootstrap2Controller} from "./bootstrap-2.controller";
import {DummyModel, DummyModelExtended} from "../../controllers/crud.controller";
import {CRUDControllerFactory} from "../../../../classes/crud-controller.class";
import {HTTP_METHOD} from "../../../../constants/methods.constant";
import {Hooks} from "../../hooks/basic.hook";
import {IServerModule} from "../../../../interfaces/server-module.interface";



@ServerModule({
    controllers: [
        Bootstrap2Controller,
        CRUDControllerFactory.of<DummyModel>(DummyModel ),
        CRUDControllerFactory.of<DummyModelExtended>(DummyModelExtended)
                                                    .setAllowedMethods(
                                                        HTTP_METHOD.GET,
                                                        HTTP_METHOD.POST,
                                                        HTTP_METHOD.PUT
                                                    )
    ],
    services: [Bootstrap2Service]
})
export class Bootstrap2Module implements IServerModule{
    constructor() {
    };

    onLoad(): any | Promise<any> {
        return Hooks;
    }
}