export declare class IndexController {
    static validResponse: {
        valid: boolean;
    };
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
}
