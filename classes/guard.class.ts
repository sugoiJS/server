export class Guard{
    private static guardians:Map<string,TGuardian> = new Map();
    static addGuardian(guard:Guard){
        Guard.guardians.set(guard.name,guard.validator);
    }

    static getGuardian(guardName:string){
        Guard.guardians.get(guardName);
    }

    static removeGuardian(guardName:string){
        Guard.guardians.delete(guardName);
    }

    constructor(private validator:TGuardian, private name:string = validator.constructor.name){}

}

export type TGuardian = (...args)=>Promise<boolean>