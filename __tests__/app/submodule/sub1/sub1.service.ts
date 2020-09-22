import {Injectable} from "../../../../index";

@Injectable()
export class Sub1Service {
    message = "hello";
    status = true;
    count = [0, 0];
    date: Date;
    date2: Date;

    public setDate(date = new Date("2018-10-18")) {
        date = ++this.count[0] > 1 ? new Date() : date;
        this.date = date;
    }

    public setDate2(date = new Date("2018-10-19")) {
        date = ++this.count[1] > 1 ? new Date() : date;
        this.date2 = date;
    }
}