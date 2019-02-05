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
const http_server_class_1 = require("../classes/http-server.class");
const auth_service_1 = require("./app/services/auth.service");
const app_1 = require("./app/app");
const path = require("path");
const express = require("express");
// import * as rp from "request-promise";
const moxios = require('moxios');
const request = require('supertest');
let server, httpserver, app;
const responses = {
    unauthorized: {
        "data": [{
                "type": "policy",
                "policyId": "SugIsAuthorized",
                "validationResult": { "data": [], "message": "Not authenticated" }
            }], "message": "Call blocked by resource policy", "code": 401
    },
    noPermissions: {
        message: 'Call blocked by resource policy',
        code: 403,
        data: [{
                "type": "policy",
                "policyId": "SugIsAuthorized",
                "validationResult": { "data": [3], "message": "Doesn't have permissions" }
            }]
    },
    noInRole: {
        message: 'Call blocked by resource policy',
        code: 403,
        data: [{
                "type": "policy",
                "policyId": "SugIsAuthorized",
                "validationResult": { "data": [3], "message": "Not in role" }
            }]
    }
};
const sugoiHeader = "x-sug-auth";
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    yield new Promise(resolve => {
        app = express();
        app.use((req, res, next) => {
            console.log("express middleware called");
            req.app.locals["test"] = req.headers["id"] ? 2 : 1;
            next();
        });
        app.all("/old", (req, res, next) => {
            res.json({ message: "fine " + req.app.locals["test"] });
        });
        httpserver = http_server_class_1.HttpServer.initializeFrom(app, app_1.Bootstrap, auth_service_1.AuthService)
            .setStatic(path.resolve(__dirname, "../static"))
            .setMiddlewares((app) => {
            app.use((req, res, next) => {
                req['AuthProvider'].getUser(req, res, next);
                next();
            });
        })
            .setErrorHandlers((app) => {
            app.use((err, req, res, next) => {
                console.error(err.code + " - " + err.message);
                delete err.stack;
                res.status(err.code).send(err);
            });
        })
            .build();
        server = httpserver
            .listen(9090, resolve);
        httpserver.getServer()
            .get("/new", (req, res, next) => {
            res.json({ message: "fine new " + req.app.locals["test"] });
        });
    });
}));
afterAll(() => {
    server.close();
});
describe("basic httpserver logic", () => {
    it("verify instance get", () => {
        expect('listen' in http_server_class_1.HttpServer.getInstance(httpserver.getInstanceId())).toBe(true);
    });
    it("verify migrated server route", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/old')
            .expect(200, { message: "fine 1" });
        yield request(server)
            .post('/old')
            .expect(200, { message: "fine 1" });
        yield request(server)
            .put('/old')
            .expect(200, { message: "fine 1" });
        yield request(server)
            .delete('/old')
            .expect(200, { message: "fine 1" });
    }));
    it("verify functional route", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/new')
            .set("id", "1")
            .expect(200, { message: "fine new 2" });
    }));
    it("resolving route info", () => {
        httpserver.getServer().post('/dynamicPath', () => null);
        expect(httpserver.getRouteInfo().toDictionary()['GET /index/:id']).toBeDefined();
        // expect(httpserver.getRouteInfo().toDictionary()['POST /dynamicPath']).toBeDefined();
        // expect(httpserver.getRouteInfo().toDictionary()['GET /old']).toBeDefined();
    });
});
describe("schema policy check", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /", () => __awaiter(this, void 0, void 0, function* () {
        const id = 12;
        yield request(server)
            .get('/index/' + id)
            .set(sugoiHeader, "34")
            .expect(200, { id: id.toString() });
    }));
});
describe("auth policy check", () => {
    const baseUri = "/index/auth/";
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /auth/id", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "resource/2")
            .expect(401, responses.unauthorized);
        yield request(server)
            .get(baseUri + "resource/2")
            .set(sugoiHeader, "34")
            .expect(403, { data: [], message: 'not an owner', code: 403 });
        yield request(server)
            .get(baseUri + "resource/1")
            .set(sugoiHeader, "1")
            .expect(200, { valid: true });
    }));
    it("#get /auth/permissions", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "permissions")
            .set(sugoiHeader, "34")
            .expect(403, responses.noPermissions);
        yield request(server)
            .get(baseUri + "permissions/approved")
            .set(sugoiHeader, "34")
            .expect(200, { valid: true });
    }));
    it("#get /auth/roles", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "roles")
            .set(sugoiHeader, "34")
            .expect(403, responses.noInRole);
        yield request(server)
            .get(baseUri + "roles/approved")
            .set(sugoiHeader, "34")
            .expect(200, { valid: true });
    }));
});
describe("sub modules check", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /sub1", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub1')
            .expect(202, { message: "hello" });
    }));
    // it("validate onLoad logic", async () => {
    //     await request(server)
    //         .get('/sub2/date')
    //         .expect(200, {date: new Date("2018-10-18").toISOString()});
    //
    // });
    // it("validate dependencies logic", async () => {
    //     await request(server)
    //         .get('/sub3/date')
    //         .expect(200, {date: new Date("2018-10-18").toISOString()});
    //
    //     // await request(server)
    //     //     .get('/sub3/date2')
    //     //     .expect(200, {date: new Date("2018-10-19").toISOString()});
    //
    // });
    // it("validate dependencies onload logic", () => {
    //     const sub1Service = httpserver.container.get(Sub1Service);
    //     expect(sub1Service.date2).toBeDefined();
    // });
});
describe("check custom reponses", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("check forbidden", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/forbidden')
            .expect(403, "forbidden");
    }));
    it("check unauthorized", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/unauthorized')
            .expect(401, "unauthorized");
    }));
    it("check ok", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/ok')
            .expect(200, "ok");
    }));
    it("check servererror", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/servererror')
            .expect(500, "error");
    }));
    it("check notfound", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/notfound')
            .expect(404, "not found");
    }));
    it("check bad request", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get('/sub3/badrequest')
            .expect(400, "bad request");
    }));
});
describe("inject check", () => {
    const baseUri = "/index/inject/";
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /inject/singleton", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "singleton")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    }));
    it("#get /inject/constant", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "constant")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    }));
    it("#get /inject/factory", () => __awaiter(this, void 0, void 0, function* () {
        yield request(server)
            .get(baseUri + "constant")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    }));
});
