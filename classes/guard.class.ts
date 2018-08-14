

export class Guard {
    public guardianValidator: any;
    private static guardians:Map<string,TPolicy> = new Map();
    static addGuardian(guard:Guard){
        Guard.guardians.set(guard.name,guard.guardianValidator);
    }

    static getGuardian(guardName:string):TPolicy{
        return Guard.guardians.get(guardName);
    }

    static removeGuardian(guardName:string){
        Guard.guardians.delete(guardName);
    }

    constructor(guardianValidator:TPolicy, private name:string = guardianValidator.constructor.name){
        this.setGuardianValidator(guardianValidator);
    }

    setGuardianValidator(guardianValidator :TPolicy){
        this.guardianValidator = (...args)=>{
            const result = guardianValidator(...args);
            if(result instanceof Promise)
                return result;
            else
                return Promise.resolve(result);
        }
    }

}

export type TPolicy = (...args)=>Promise<true>|true|Promise<any>|any