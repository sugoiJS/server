import {HttpServer} from "../classes/http-server.class";
import {AuthService} from "./app/services/auth.service";
import {Bootstrap} from "./app/app";
import {Server} from "net";
import * as path from "path";
import * as express from "express";
import {SugoiServerError} from "../exceptions/server.exception";
import {Sub1Service} from "./app/submodule/sub1/sub1.service";
import {Sub1Module} from "./app/submodule/sub1/sub1.module";
// import * as rp from "request-promise";
const moxios = require('moxios');
const request = require('supertest');


let server: Server, httpserver: HttpServer,app:express.Application;
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
        app = express() as express.Application;
        app.use((req,res,next)=>{
            console.log("express middleware called");
            req.app.locals["test"] = req.headers["id"] ? 2 : 1;
            next();
        });
        app.all("/old",(req,res,next)=>{
            res.json({message:"fine "+req.app.locals["test"]});
        });
         httpserver = HttpServer.initializeFrom(app,Bootstrap, AuthService)
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
            .listen(9090, resolve);

        httpserver.getServer()
            .get("/new",(req,res,next)=>{
            res.json({message:"fine new "+req.app.locals["test"]})
        })
    });
});

afterAll(() => {
    server.close();
});

describe("basic httpserver logic", () => {
    it("verify instance get", () => {
        expect('listen' in HttpServer.getInstance(httpserver.getInstanceId())).toBe(true);
    });

    it("verify migrated server route",async ()=>{
        await request(server)
            .get('/old')
            .expect(200, {message:"fine 1"});

        await request(server)
            .post('/old')
            .expect(200, {message:"fine 1"});

        await request(server)
            .put('/old')
            .expect(200, {message:"fine 1"});

        await request(server)
            .delete('/old')
            .expect(200, {message:"fine 1"});
    })

    it("verify functional route",async ()=>{
        await request(server)
            .get('/new')
            .set("id","1")
            .expect(200, {message:"fine new 2"});
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
            .expect(202, {message: "hello"});
    });

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