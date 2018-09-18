# @Sugoi/Server

![Sugoi logo](https://sugoijs.com/assets/logo_inverse.png)


## Introduction
SugoiJS is a minimal modular framework.

SugoiJS gives you the ability to use only what you need and do it fast.

this is a standalone module that can be functional on its own (as all of the SugoiJS modules).

This module provides singleton services, request handling decorators and request policies decorators.

SugoiJS server uses [inversify](https://www.npmjs.com/package/inversify), [inversify-express-utils](https://www.npmjs.com/package/inversify-express-utils) and re-export those modules

## Installation

> npm install --save @sugoi/server

### tsconfig.json:

Under your tsconfig - compilerOptions set:

- `"target": "es5"`

- `"emitDecoratorMetadata": true`

- `"experimentalDecorators": true`

- `"lib": ["es2015","dom"]`


#### Template

You are able to use the config template which was set for the @sugoi/demo application:

    {
      "compilerOptions": {
        "baseUrl": "./src",
        "allowJs": true,
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
          "es2015",
          "dom"
        ],
        "typeRoots": [
          "./node_modules/@types"
        ],
        "types": [
          "body-parser",
          "express",
          "node"
        ]
      }
    }

### Bootstrapping

To boostrap you server use the 'init' method:

    init(boostrapModule: any, rootPath?: string, moduleMetaKey?: string, authProvider?: AuthProvider)

when boostrapModule is the entry point module

> rootPath - Server uri prefix

    import {HttpServer} from "@sugoi/server";

    const server:HttpServer = HttpServer.init(ServerModule,"/api");

### Build & listen
After setting the middlewares and error handlers, build and listen to requests by:

    (<HttpServer>server).build()
        .listen(PORT, (error: Error) => {
            if (error) {
                logger.error(error.message);
                throw error;
            }
            logger.debug(`Server running @ ${HOST}:${PORT}`);
        });

This call will return http.Server instance which can be use for setting app variables, socket server and more.

### Set module
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

### Set controller

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

### Set service
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

#### Variable binding

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
            if (DEVELOPMENT) {
                app.set('json spaces', 2);
                app.use(cors());
                app.use(require('morgan')('dev'));
            }
            app.use(express.static(paths.static));
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
            return User.findOne({id,role.text})
        }

    }
    
    
### Authorized
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

        isAllowedTo(...permissions: Array<string | number>): Promise<boolean> {
            return this.getUser().then(user=>permissions.every(permission=>user.permissions.includes(permission)));
        }
        
        isResourceOwner(resourceId: any): Promise<boolean> {
            return this.getUser().then(user=>Resources.checkIfOwner(resourceId,user.id));
        }

    }
    
    `init(boostrapModule,"/",null, Authorization)`



Example:

    @Controller('/dashboard')
    export class DashboardController {
        constructor() {
        }

        @HttpPost("/:id")
        @Authorized(["User","Admin"],"User.READ")
        getUser(@RequestParam("id") id:number, @RequestBody("role") role:{text:string}) {
            return User.findOne({id,role.text})
        }

    }


## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)
