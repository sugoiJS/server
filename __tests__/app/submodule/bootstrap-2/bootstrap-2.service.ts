
import {Injectable} from "@sugoi/core";

@Injectable()
export class Bootstrap2Service{
    private text: string = 'hello';
    public index(){
        return this.text;
    }
}