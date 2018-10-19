import {HttpServer} from "../classes/http-server.class";
import {AuthService} from "./app/services/auth.service";
import {Bootstrap} from "./app/app";
import {Server} from "net";
import * as path from "path";
import {SugoiServerError} from "../exceptions/server.exception";
import {Sub1Service} from "./app/submodule/sub1/sub1.service";
import {Sub1Module} from "./app/submodule/sub1/sub1.module";
// import * as rp from "request-promise";
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
    noInRole: {
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
        httpserver = HttpServer.init(Bootstrap, "/", null, AuthService)
            .setStatic(path.resolve(__dirname, "../static"))
            .setMiddlewares((app) => {
                app.use((req, res, next) => {
                    (<AuthService>req['AuthProvider']).getUser(req, res, next);
                    next();
                });
            })
            .setErrorHandlers((app) => {
                app.use((err: SugoiServerError, req, res, next) => {
                    console.error(err.code + " - " + err.message);
                    delete err.stack;
                    res.status(err.code).send(err);
                })
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
        expect(HttpServer.init(Bootstrap, "/testing", "test").getNamespace()).toBe("test");
    });

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
            .expect(403, responses.noInRole);

        await request(server)
            .get(baseUri + "roles/approved")
            .set(sugoiHeader, "34")
            .expect(200, {valid: true});
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
            .expect(200, {message: "hello"});
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