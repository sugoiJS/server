import {AuthService} from "./app/services/auth.service";
import {Server} from "net";
import * as path from "path";
import * as express from "express";
import {HttpServer, defaultErrorHandler} from "../index";
import {Bootstrap2Module} from "./app/submodule/bootstrap-2/bootstrap-2.module";
import {DummyModel} from "./app/controllers/crud.controller";

const moxios = require('moxios');
const request = require('supertest');

let server: Server, httpserver: HttpServer, listenError;


beforeAll(async () => {
    httpserver = HttpServer.init(Bootstrap2Module, "/base", AuthService)
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
    return await new Promise(resolve => {
        server = httpserver
            .listen(19998, (err) => {
                listenError = err;
                resolve(err);
            });
    });
});
afterAll(() => {
    server.close();
});

describe('Basic', () => {
    it('Server listen', () => {
        expect.assertions(1);
        expect(listenError).not.toBeDefined();
    })
});


describe('CRUD static of', () => {
    const storeObject = {test: 1, id: "1"},
        storeObject2 = {test: 1, id: "2"},
        BASE_URI = '/base/DummyModel';

    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it('CREATE', async () => {
        await request(server)
            .post(BASE_URI)
            .send(storeObject)
            .expect(200, storeObject);

        await request(server)
            .post(BASE_URI)
            .send(storeObject2)
            .expect(200, storeObject2);

    });

    it('UPDATE', async () => {
        storeObject.test++;
        await request(server)
            .put(BASE_URI +"/"+ storeObject.id)
            .send(storeObject)
            .expect(200, storeObject);

    });

    it('DELETE', async () => {
        await request(server)
            .delete(BASE_URI +"/"+ storeObject.id)
            .expect(200, storeObject);

    });
    it('READ', async () => {
        await request(server)
            .get(BASE_URI +"/"+ storeObject2.id)
            .expect(200, storeObject2);

    });

    it('READ ALL', async () => {
        await request(server)
            .get(BASE_URI)
            .expect(200, [storeObject2]);

    });
});

describe('CRUD static of 2', () => {
    const storeObject = {test: 2, id: "11"},
        storeObject2 = {test: 2, id: "22"},
        BASE_URI = '/base/DummyModel2';

    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it('CREATE', async () => {
        await request(server)
            .post(BASE_URI)
            .send(storeObject)
            .expect(200, storeObject);

        await request(server)
            .post(BASE_URI)
            .send(storeObject2)
            .expect(200, storeObject2);

    });

    it('UPDATE', async () => {
        storeObject.test++;
        await request(server)
            .put(BASE_URI +"/"+ storeObject.id)
            .send(storeObject)
            .expect(200, storeObject);

    });

    it('READ', async () => {
        await request(server)
            .get(BASE_URI +"/"+ storeObject2.id)
            .expect(200, storeObject2);

    });

    it('DELETE PREVENTED', async () => {
        await request(server)
            .delete(BASE_URI +"/"+ storeObject.id)
            .expect(403);

    });

    it('READ ALL', async () => {
        await request(server)
            .get(BASE_URI)
            .expect(200, [storeObject,storeObject2]);

    });

});
describe('Hooks check', () => {
    const storeObject = {test: 2, id: "11"},
        BASE_URI = '/base/bootstrap2/HookChecker';

    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it('CREATE', async () => {
        await request(server)
            .post(BASE_URI)
            .send(storeObject)
            .expect(200, storeObject);

        expect(DummyModel['hookChecker']).toEqual(storeObject.id);
        await request(server)
            .get(BASE_URI)
            .expect(200);
        expect(DummyModel['hookChecker']).not.toBeDefined();


    });
});

describe('Caster',()=>{
    const BASE_URI = '/base/bootstrap2/cast';
    it("#post /sub1/cast", async () => {
        const user = {name: "tester"};
        await request(server)
            .post(BASE_URI)
            .send(user)
            .expect(200, {valid: true, user: Object.assign({id: '123'}, user)});
    });
})

describe('Timeout', () => {
    const storeObject = {test: 2, id: "11"},
        BASE_URI = '/base/bootstrap2/';

    beforeEach(() => {

        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    it('timeout', async () => {
        return await request(server)
            .get(BASE_URI+"timeout")
            .expect(504);
    });

    it('timeoutSuccess', async () => {
        return await request(server)
            .get(BASE_URI+"timeoutSuccess")
            .expect(200);
    });

    it('no timeout', async () => {
        return await request(server)
            .get(BASE_URI+"NoTimeout")
            .expect(200);
    });

});
