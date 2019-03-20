import { TestService } from "../services/test.service";
export declare class IndexController {
    static validResponse: {
        valid: boolean;
    };
    testSingleton: TestService;
    testInstance: TestService;
    testFactory: TestService;
    getData(id: string): {
        id: string;
    };
    isOwner(req: any, id: string): Promise<{
        valid: boolean;
    }>;
    shouldHavePermissions(): void;
    shouldHavePermissionsApproved(): {
        valid: boolean;
    };
    shouldBeInRole(): void;
    shouldBeInRoleApproved(): {
        valid: boolean;
    };
    getSingleton(req: any): boolean;
    getConst(req: any): boolean;
    getFactory(req: any): boolean;
}
