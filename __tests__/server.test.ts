import {HttpServer} from "../classes/http-server.class";
import {AuthService} from "./app/services/auth.service";
import {Bootstrap} from "./app/app";
import * as rp from "request-promise";
import {Server} from "net";

let server:Server;
const baseUrl = "http://localhost:9999";
beforeAll(async ()=>{
    await new Promise(resolve => {
        server = HttpServer.init(Bootstrap, "/", null, AuthService)
            .setMiddlewares((app) => {
                app.use(req => console.log(req['AuthProvider']));
            })
            .setErrorHandlers((app) => {
                app.use(err => console.error(err))
            })
            .build()
            .listen(9999,"0.0.0.0",resolve);
    });
});

afterAll(()=>{
    // server.close();
});

describe("schema policy check",()=>{
    it("#get /",async ()=>{
        try {
            const data = await rp({
                method: "GET",
                uri: baseUrl + "/index/12",
                qs: {}
            });
            console.log(data);
        }catch(err){
            console.error(err);
        }
    },10000)
});