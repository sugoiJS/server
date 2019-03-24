import {AuthService} from "./app/services/auth.service";
import {Server} from "net";
import * as path from "path";
import {HttpServer, defaultErrorHandler} from "../index";
import {Bootstrap2Module} from "./app/submodule/bootstrap-2/bootstrap-2.module";

let server: Server, httpserver: HttpServer;
const sugoiHeader = "x-sug-auth";


beforeAll(async () => {
    httpserver = HttpServer.init(Bootstrap2Module, "/base", null, AuthService)
        .setStatic(path.resolve(__dirname, "../static"))
        .setMiddlewares((app) => {
            app.use((req, res, next) => {
                (<AuthService>req['AuthProvider']).getUser(req, res, next);
                next();
            });
        })
        .setErrorHandlers((app) => {
            app.use(defaultErrorHandler(false))
        })
        .build();

});
afterAll(() => {
    server.close();
});

describe('Basic', () => {
    it('Server listen', async () => {
        expect.assertions(1);
        return await new Promise(resolve => {
            console.log("init start", performance.now());
            server = httpserver
                .listen(9990, (err) => {
                    console.log("init done", performance.now());
                    console.error(err);
                    expect(err).not.toBeDefined();
                    resolve();
                });
        });
    })
});