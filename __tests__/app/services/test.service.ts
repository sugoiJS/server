
import {Injectable} from "@sugoi/core";

@Injectable()
export class TestService  {
    private testNum: number;
    constructor(){
    }

    setNumber(testNum){
        this.testNum = testNum;
        return this;
    }

    getTest(){
        return this.testNum;
    }
}