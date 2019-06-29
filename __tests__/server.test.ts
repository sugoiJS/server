import {AuthService} from "./app/services/auth.service";
import {Bootstrap} from "./app/app";
import {Server} from "net";
import * as path from "path";
import {HttpServer, defaultErrorHandler, ModuleMetaKey} from "../index";
import {Sub1Service} from "./app/submodule/sub1/sub1.service";
import * as express from 'express';

const moxios = require('moxios');
const request = require('supertest');

let server: Server, httpserver: HttpServer;
const responses = {
    unauthorized: {
        "data": [{
            "type": "policy",
            "policyId": "SugIsAuthorized",
            "validationResult": {"data": [], "message": "Not authenticated"}
        }], "message": "Call blocked by resource policy", "code": 401
    },
    noPermissions: {
        message: 'Call blocked by resource policy',
        code: 403,
        data: [{
            "type": "policy",
            "policyId": "SugIsAuthorized",
            "validationResult": {"data": [3], "message": "Doesn't have permissions"}
        }]
    },
    notInRole: {
        message: 'Call blocked by resource policy',
        code: 403,
        data: [{
            "type": "policy",
            "policyId": "SugIsAuthorized",
            "validationResult": {"data": [3], "message": "Not in role"}
        }]
    }
};
const sugoiHeader = "x-sug-auth";
beforeAll(async () => {
    await new Promise(resolve => {
        httpserver = HttpServer.init(Bootstrap, "/", AuthService)
            .setStatic(path.resolve(__dirname, "../static"))
            .setMiddlewares((app) => {
                app.use(express.json());
                app.use((req, res, next) => {
                    (<AuthService>req['AuthProvider']).getUser(req, res, next);
                    next();
                });
            })
            .setErrorHandlers((app) => {
                app.use(defaultErrorHandler(false))
            })
            .build();
        server = httpserver
            .listen(9999, resolve);
    });
});

afterAll(() => {
    server.close();
});

describe("basic httpserver logic", () => {
    it("verify instance get", () => {
        expect('listen' in HttpServer.getInstance(httpserver.getInstanceId())).toBe(true);
    });

    it("namespace validation", () => {
        expect(HttpServer.init(Bootstrap, "/testing").getNamespace()).toBe(ModuleMetaKey);
    });

    it("resolving route info",()=>{
        expect(httpserver.getRouteInfo().toDictionary()['GET /index/:id']).toBeDefined();
    });

    it("resolving route string info",()=>{
        expect(httpserver.getRouteInfo().toString()).toEqual(JSON.stringify(httpserver.getRouteInfo().toDictionary()));
    })

});

describe("schema policy check", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /", async () => {
        const id = 12;
        await request(server)
            .get('/index/' + id)
            .set(sugoiHeader, "34")
            .expect(200, {id: id.toString()});
    })
});

describe("auth policy check", () => {
    const baseUri = "/index/auth/";
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /auth/id", async () => {
        await request(server)
            .get(baseUri + "resource/2")
            .expect(401, responses.unauthorized);


        await request(server)
            .get(baseUri + "resource/2")
            .set(sugoiHeader, "34")
            .expect(403, {data: [], message: 'not an owner', code: 403});

        await request(server)
            .get(baseUri + "resource/1")
            .set(sugoiHeader, "1")
            .expect(200, {valid: true});
    })

    it("#get /auth/permissions", async () => {
        await request(server)
            .get(baseUri + "permissions")
            .set(sugoiHeader, "34")
            .expect(403, responses.noPermissions);

        await request(server)
            .get(baseUri + "permissions/approved")
            .set(sugoiHeader, "34")
            .expect(200, {valid: true});
    })

    it("#get /auth/roles", async () => {
        await request(server)
            .get(baseUri + "roles")
            .set(sugoiHeader, "34")
            .expect(403, responses.notInRole);

        await request(server)
            .get(baseUri + "roles/approved")
            .set(sugoiHeader, "34")
            .expect(200, {valid: true});
    })

});

describe("CRUD auth policy check", () => {
    const baseUri = "/CrudTesting/";
    const storeObject = {test: 1, id: "1"};
    const storeObject2 = {test: 2, id: "2"};
    beforeEach(async () => {
        moxios.install();

        await request(server)
            .post(baseUri)
            .set(sugoiHeader, "34")
            .send(storeObject)
            .expect(200, storeObject);

        await request(server)
            .post(baseUri)
            .set(sugoiHeader, "34")
            .send(storeObject2)
            .expect(200, storeObject2);
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /CrudTesting", async () => {
        await request(server)
            .get(baseUri + "2")
            .expect(401, responses.unauthorized);


        // await request(server)
        //     .get(baseUri + "1")
        //     .set(sugoiHeader, "34")
        //     .expect(403);

        await request(server)
            .get(baseUri + "1")
            .set(sugoiHeader, "34")
            .expect(200, storeObject);
    });
});

describe("inject check", () => {
    const baseUri = "/index/inject/";
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it("#get /inject/singleton", async () => {
        await request(server)
            .get(baseUri + "singleton")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    })

    it("#get /inject/constant", async () => {
        await request(server)
            .get(baseUri + "constant")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    })

    it("#get /inject/factory", async () => {
        await request(server)
            .get(baseUri + "constant")
            .set(sugoiHeader, "34")
            .expect(200, 'true');
    })

});

describe("sub modules check", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("#get /sub1", async () => {
        await request(server)
            .get('/sub1')
            .expect(202, {message: "hello"});
    });

    it("validate onLoad logic", async () => {
        await request(server)
            .get('/sub2/date')
            .expect(200, {date: new Date("2018-10-18").toISOString()});

    });


    it("validate dependencies logic", async () => {
        await request(server)
            .get('/sub3/date')
            .expect(200, {date: new Date("2018-10-18").toISOString()});

        await request(server)
            .get('/sub3/date2')
            .expect(200, {date: new Date("2018-10-19").toISOString()});

    });

    it("validate dependencies onload logic", () => {
        const sub1Service = httpserver.container.get(Sub1Service);
        expect(sub1Service.date2).toBeDefined();
    });


});

describe("check custom reponses", () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    it("check forbidden",async () => {
        await request(server)
            .get('/sub3/forbidden')
            .expect(403, "forbidden");
    });

    it("check unauthorized",async () => {
        await request(server)
            .get('/sub3/unauthorized')
            .expect(401, "unauthorized");
    });

    it("check ok",async () => {
        await request(server)
            .get('/sub3/ok')
            .expect(200, "ok");
    });

    it("check servererror",async () => {
        await request(server)
            .get('/sub3/servererror')
            .expect(500, "error");
    });

    it("check notfound",async () => {
        await request(server)
            .get('/sub3/notfound')
            .expect(404, "not found");
    });

    it("check bad request",async () => {
        await request(server)
            .get('/sub3/badrequest')
            .expect(400, "bad request");
    });

});