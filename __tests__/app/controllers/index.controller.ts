import {
    Authorized,
    Controller,
    Request,
    ComparableSchema,
    SchemaTypes,
    RequestSchemaPolicy,
    HttpGet,
    RequestParam,
    RequestParamsSchemaPolicy,
    RequestBodySchemaPolicy,
    RequestHeadersSchemaPolicy,
    RequestQueryParamsSchemaPolicy
} from "../../../index";
import {AuthService} from "../services/auth.service";
import {SugoiServerError} from "../../../exceptions/server.exception";

const RequestWithIDSchema = {id: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true)};

@Authorized()
@Controller("/index")
export class IndexController {
    static validResponse = {valid: true};

    @HttpGet("/:id")
    @RequestParamsSchemaPolicy(RequestWithIDSchema)
    @RequestQueryParamsSchemaPolicy({check: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(false)})
    @RequestBodySchemaPolicy({check: ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(false)})
    public getData(@RequestParam("id") id: string) {

        return {id}
    }

    @HttpGet("/auth/resource/:id")
    public async isOwner(@Request() req,
                         @RequestParam("id") id: string) {
        return await (<AuthService>req.getAuthProvider()).isResourceOwner(id)
            .then((valid) => {
                if (valid)
                    return IndexController.validResponse;
                else
                    throw new SugoiServerError("not an owner", 403);
            });
    }

    @HttpGet("/auth/permissions")
    @Authorized(null, 3, 403)
    public shouldHavePermissions() {
    }

    @HttpGet("/auth/permissions/approved")
    @Authorized(null, [2, 4], 403)
    public shouldHavePermissionsApproved() {
        return IndexController.validResponse;
    }

    @HttpGet("/auth/roles")
    @Authorized(3, null, 403)
    public shouldBeInRole() {
    }

    @HttpGet("/auth/roles/approved")
    @RequestHeadersSchemaPolicy({"x-sug-auth": ComparableSchema.ofType(SchemaTypes.STRING).setMandatory(true)})
    @Authorized([2, 4], null, 403)
    public shouldBeInRoleApproved() {
        return IndexController.validResponse;
    }
}
