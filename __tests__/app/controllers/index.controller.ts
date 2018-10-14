import {
    Authorized,
    Controller,
    AuthProviderResolver,
    AuthProvider,
    ComparableSchema,
    SchemaTypes,
    RequestSchemaPolicy,
    HttpGet,
    RequestParam
} from "../../../index";

// @Authorized()
@Controller("/index")
export class IndexController {
    // @RequestSchemaPolicy({id: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true)})
    @HttpGet("/:id")
    public getData(@AuthProviderResolver() authProvider: AuthProvider,
                   @RequestParam("id") id: string) {
        console.log(authProvider);
        console.log(id);
        return authProvider.getUserData()
    }
}