# @Sugoi/Server

![Sugoi logo](https://sugoijs.com/assets/logo_inverse.png)

[![npm version](https://badge.fury.io/js/%40sugoi%2Fserver.svg)](https://badge.fury.io/js/%40sugoi%2Fserver)
[![Build Status](https://travis-ci.org/sugoiJS/ORM.svg?branch=master)](https://travis-ci.org/sugoiJS/server)
[![codecov](https://codecov.io/gh/sugoiJS/ORM/branch/master/graph/badge.svg)](https://codecov.io/gh/sugoiJS/server)

## Introduction
SugoiJS is a minimal modular framework.

SugoiJS gives you the ability to use only what you need and do it fast.

this is a standalone module that can be functional on its own (as all of the SugoiJS modules).

This module provides singleton services, request handling decorators and request policies decorators.

SugoiJS server uses [inversify](https://www.npmjs.com/package/inversify), [inversify-express-utils](https://www.npmjs.com/package/inversify-express-utils) and re-export those modules

## Installation

Setting a SugoiJS application is only three steps away.

#### Installing @sugoi/cli
	
	$ npm i -g @sugoi/cli
	
#### Run SugoiJS initialization wizard

Use the initialization wizard to define your needs.

	$ sugoi init 

Or

	$ sgi init

#### Install & Run

All you left to do is to install the packages and run your server!

	$ npm i && npm start

#### Enjoy your new server

As soon you will done the installation you should be able to reach
`http://localhost:3000` for reach the client application and `http://localhost:3000/index` for reach the API endpoint.

#### File structure

	├───client        <-- Your web client application directory
	│   └───assets
	├───common        <-- Common (shared) files between client and server
	└───server        <-- Your SugoiJS server directory
	    ├───config    <-- Build config (environment, webpack)
	    │   └───webpack
	    └───src       <-- Your server app source code
		├───app   <-- Bootstrap module, Server initialize and listener files, 'authorization' class(optional)
		│   └───classes
		├───config     <-- Server configuration (services, paths, etc.)
		└───modules    <-- All of you application modules
		    └───index  <-- Single module
			├───controllers    <-- Modules' controllers
			├───models         <-- Modules' models(optional)
			└───services       <-- Modules' services

#### Migrate existing project

SugoiJS support migrate existing project by providing hybrid mode.

For achieving this approach use the `initializeFrom` method

`HttpServer.initializeFrom(sourceApp: TServer, bootstrapModule: any, authProvider?: TNewable<AuthProvider>)`

`TServer - http.Server | https.Server | { listen: (...args) => any }`

Example:

    import {HttpServer} from "@sugoi/server";

    const server:HttpServer = HttpServer.initializeFrom(myExpressApp,ServerModule);

### Build & listen
After setting the middlewares and error handlers, build and listen to requests by:

    //HttpServer instance
    server
        .setStatic("assets")
        .setMiddlewares((app) => {
            app.use(bodyParser.json());
            app.use(compression());
        })
        .setErrorHandlers((app) => {
            app.use(function (req, res, next) {
                return res.sendFile(path.resolve(paths.index))
            });
            app.use((req,res,next)=>{
                return function(err){
                    if(err instanceof SugoiServerError){
                        console.log.error(err.stack);
                        console.log.error(`${err.message} ${JSON.stringify(err.data)});
                        res.status(500).send("Internal error");
                    }
                }
            });
        })
		.listen(PORT, (error: Error) => {
		            if (error) {
		                logger.error(error.message);
		                throw error;
		            }
		            logger.debug(`Server running @ ${HOST}:${PORT}`);
        });

This call will return http.Server instance which can be use for setting app variables, socket server and more.

### Set a module
Creating a module requires you to should use the @ServerModule decorator

    import {ServerModule} from "@sugoi/server"
    @ServerModule({
        controllers:[CoreController],
        services: [CoreService],
        modules:[LoginModule,DashboardModule]
    })
    export class ServerModule{
        constructor(){}
    }

### Set a controller

SugoiJS use inversify-express-utils decorators and re-export them (also with alias to capitalize camel-case decorator names)

    import {Controller,Response,HttpGet,RequestParam} from "@sugoi/server";

    @Controller('/dashboard')
    export class CoreController{
        constructor(){}

        @HttpGet("/:role")
        test(@response() response,@requestParam('role') role){
            if(role === "user" )
                return "authorized";
            else{
                throw new Error("unauthorized")
            }
        }
    }

Further information can be found on [Inversify-express-utils documentation](https://github.com/inversify/inversify-express-utils)

### Set a service
For setting class as service the class must be decorated with `@Injectable` decorator, this will set the class as singleton.

    @Injectable()
    class MyService{
        public listeners:number = 0;

        public incListeners(){
            this.listeners++;
        }

        public decListeners(){
            this.listeners--;
        }
    }

later we will be able to inject the service instance by:

### Variable binding

 - `@Inject(MyService) private myService:MyService`

 - `@Inject("MyService") private myService:MyService`

 - `constructor(private myService:MyService)`
 
 #### Return the value from the "container"
   
   The [InversifyJS container](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md) is handling the singleton objects.
   
   The container is stored on the server instance, each request and the `ServerContainerService` by the instanceId
   
 - `server.container`
 
 -  `req.container`
 
 - `ServerContainerService.getContainerById(serverInstanceId)`
 
 After retriving the container we will able to get the service instance:
 
 - `private myService:MyService = container.get(MyService)`

 - `private myService:MyService = container.get("MyService")`

### Setting middlewares and Error handlers
For setting static file serving use:

    setStatic(pathToStatic:string,route?:string)

For setting middlewares use:

    setMiddlewares(...(app)=>void)

For setting error handlers use:

    setErrorHandlers((app) => void)

Full example:

    (<HttpServer>server)
        .setStatic("assets/admin","/admin")
        .setStatic("assets/main")
        .setMiddlewares((app) => {
            app.use(bodyParser.json());
            app.use(compression());
        })
        .setErrorHandlers((app) => {
            app.use(function (req, res, next) {
                return res.sendFile(path.resolve(paths.index))
            });
            app.use((req,res,next)=>{
                return function(err){
                    if(err instanceof SugoiServerError){
                        console.log.error(err.stack);
                        console.log.error(`${err.message} ${JSON.stringify(err.data)});
                        res.status(500).send("Internal error");
                    }
                }
            });
        });



## Policies

@sugoi/server uses @sugoi/core policies and supply predefined policies.

And re-export SchemaTypes, TPolicy, TComparableSchema, Policy, UsePolicy, ComparableSchema from "@sugoi/core";

Further information on the [@sugoi/core package documentation](https://sugoijs.com/#/documentation/core/index)

### RequestSchemaPolicy

    /**
     *  paramSchema         - req.params
     *  queryParamSchema    - req.query
     *  bodySchema          - req.body
     *  headersSchema       - req.headers
     **/
    RequestSchemaPolicy(paramSchema?: TComparableSchema,queryParamSchema?: TComparableSchema,bodySchema?: TComparableSchema,headersSchema?: TComparableSchema)

The `RequestSchemaPolicy` decorator use for validate the request is using a valid schema for params\queryParams\body\headers.

In case null will pass the value won't check.

Example:

    @Controller('/dashboard')
    export class DashboardController {
        constructor() {
        }

        @HttpPost("/:id")
        @RequestSchemaPolicy({"id": ComparableSchema.ofType(SchemaTypes.NUMBER)},
                              null,
                              {"role": ComparableSchema.ofType({text: ComparableSchema.ofType(SchemaTypes.STRING).setRegex("([A-Z])+","i")})})
                              //body schema is {role:{text:string//with regex /([A-Z])+/i}}
        getUser(@RequestParam("id") id:number, @RequestBody("role") role:{text:string}) {
            return User.findOne({id,role:role.text})
        }

    }
    
    
### Authorization

#### Authorized
    /**
     *  requiredRole: TStringOrNumber|TStringOrNumber[] - The required role(s)
     *  permissions: TStringOrNumber|TStringOrNumber[]  - The required premission(s)
     *  failedCode: number                              - The response code in case the policy will fail
     **/
    Authorized(requiredRole: TStringOrNumber|TStringOrNumber[] = null, permissions: TStringOrNumber|TStringOrNumber[] = null, failedCode: number = 401)

The `Authorized` decorator use for validate the user is Authorized and in the right role and permissions(optional).

In case null will pass the value won't check.

The Authorized policy will use the AuthProvider which pass while the server init:
    `init(boostrapModule: any, rootPath?: string, moduleMetaKey?: string, authProvider?: AuthProvider)`

The AuthProvider will init for each request, the AuthProvider holding the request headers & cookies.

Example:
    
##### Authorization.class.ts:
    
    export class Authorization extends AuthProvider<User> {


        /**
         * Verify if user is authorized
         *
         * Implemented dummy check for x-sug-demo header to be equal to "Wyn1RRR9PQJPaqYM"
         *
         * @returns {Promise<boolean>}
         */
        isAuthenticated(): Promise<boolean> {
            return Promise.resolve(this.headers["x-sug-demo"] === "Wyn1RRR9PQJPaqYM");
        }

        getUser(req?: e.Request, res?: e.Response, next?: e.NextFunction): Promise<any> {
            return this.details 
                ?   Promise.resolve(this.details)
                : UserService.getUser(UserService.getIdFromCookie(this.cookie))
                              .then((user:User)=>{
                                this.details = user;
                                return user;
                              })
        }

        isInRole(...roles: Array<string | number>): Promise<boolean> {
            return this.getUser().then(user=>roles.includes(user.role));

        }
        
        /**
        * Check if on of user has some of the permissions.
        **/
        isAllowedTo(...permissions: Array<string | number>): Promise<boolean> {
            return this.getUser().then(user=>permissions.some(permission=>user.permissions.includes(permission)));
        }
        
        isResourceOwner(resourceId: any): Promise<boolean> {
            return this.getUser().then(user=>Resources.checkIfOwner(resourceId,user.id));
        }

    }
    
##### app.ts:
    
    `init(boostrapModule,"/",null, Authorization)`



##### dashboard.controller.ts:

    @Controller('/dashboard')
    export class DashboardController {
        constructor() {
        }

        @HttpPost("/:id")
        @Authorized(["User","Admin"],"User.READ")
        @Authorized(null,"User.READ_BY_ID") // This case promise the user have both "User.READ" AND "User.READ_BY_ID" permissions
        getUser(@RequestParam("id") id:number, @RequestBody("role") role:{text:string}) {
            return User.findOne({id,role:role.text})
        }

    }



## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)
