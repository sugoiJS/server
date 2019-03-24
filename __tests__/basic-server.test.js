"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("./app/services/auth.service");
const path = require("path");
const index_1 = require("../index");
const bootstrap_2_module_1 = require("./app/submodule/bootstrap-2/bootstrap-2.module");
let server, httpserver;
const sugoiHeader = "x-sug-auth";
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    httpserver = index_1.HttpServer.init(bootstrap_2_module_1.Bootstrap2Module, "/base", null, auth_service_1.AuthService)
        .setStatic(path.resolve(__dirname, "../static"))
        .setMiddlewares((app) => {
        app.use((req, res, next) => {
            req['AuthProvider'].getUser(req, res, next);
            next();
        });
    })
        .setErrorHandlers((app) => {
        app.use(index_1.defaultErrorHandler(false));
    })
        .build();
}));
afterAll(() => {
    server.close();
});
describe('Basic', () => {
    it('Server listen', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        return yield new Promise(resolve => {
            console.log("init start", performance.now());
            server = httpserver
                .listen(9990, (err) => {
                console.log("init done", performance.now());
                console.error(err);
                expect(err).not.toBeDefined();
                resolve();
            });
        });
    }));
});
