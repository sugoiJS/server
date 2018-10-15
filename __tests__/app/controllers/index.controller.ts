import {
    Authorized,
    Controller,
    Request,
    ComparableSchema,
    SchemaTypes,
    RequestSchemaPolicy,
    HttpGet,
    RequestParam
} from "../../../index";
import {AuthService} from "../services/auth.service";

@Authorized()
@Controller("/index")
export class IndexController {
    static validResponse = {valid: true};

    @HttpGet("/:id")
    @RequestSchemaPolicy({id: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true)})
    public getData(@RequestParam("id") id: string) {

        return {id}
    }

    @HttpGet("/auth/resource/:id")
    public async isOwner(@Request() req,
                         @RequestParam("id") id: string) {
        return await (<AuthService>req.getAuthProvider()).isResourceOwner(id)
            .then((valid) => valid ? IndexController.validResponse : {valid:false});
    }

    @HttpGet("/auth/permissions")
    @Authorized(null,  3, 403)
    public shouldHavePermissions() {}

    @HttpGet("/auth/permissions/approved")
    @Authorized(null, [2, 4], 403)
    public shouldHavePermissionsApproved() {
        return IndexController.validResponse;
    }

    @HttpGet("/auth/roles")
    @Authorized(3, null, 403)
    public shouldBeInRole() {}

    @HttpGet("/auth/roles/approved")
    @Authorized([2, 4], null, 403)
    public shouldBeInRoleApproved() {
        return IndexController.validResponse;
    }
}
