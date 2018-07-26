# @Sugoi/server

![Sugoi logo](https://sugoijs.com/assets/logo_inverse.png)


## Introduction
Sugoi server module is part of the modular Sugoi framework.

The server module can be use as stand alone library.

This module provide singleton services and decorators.

Sugoi server use [inversify](https://www.npmjs.com/package/inversify) and [inversify-express-utils](https://www.npmjs.com/package/inversify-express-utils) and re-export those modules

## Installation

 For installing the Sugoi/server module run:
> npm install --save @sugoi/server @sugoi/core


### Set controller

    import {controller,response,httpGet,requestParam} from "@sugoi/server";

    @controller('/dashboard')
    export class CoreController{
        constructor(){}

        @httpGet("/:role")
        test(@response() response,@requestParam('role') role){
            if(role === "user" )
                return "authorized";
            else{
                throw new Error("unauthorized")
            }
        }
    }

### Set service
 Service can be any class you want with no special deorators.

### Set module
  for setting module you should use the @SugModule annotation

    import {SugModule} from "@sugoi/server"

    @SugModule({
        controllers:[CoreController],
        services: [CoreService],
        modules:[LoginModule,DashboardModule]
    })
    export class ServerModule{
        constructor(){}
    }

### Bootstrapping
For bootstrapping we will use the init method
> init(boostrapModule: any, rootPath?: string, moduleMetaKey?: string, authProvider?: AuthProvider, container?: inversify.Container)

> boostrapModule - Entry point module

> rootPath - Server uri prefix

    import {HttpServer} from "@sugoi/server";

    const server:HttpServer = HttpServer.init(ServerModule,"/api");

### Setting middlewares and Error handlers
For setting static file serving use

>   setStatic(pathToStatic:string,route?:string)

For setting middlewares  we will use

>   setMiddlewares(...(app)=>void)

For setting error handlers we will use

>   setErrorHandlers((app) => void)


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

### Build & listening
After setting the middlewares and error handlers we can build and listen to request by:

    (<HttpServer>server).build(PORT)
        .listen(PORT, (error: Error) => {
            if (error) {
                logger.error(error.message);
                throw error;
            }
            logger.debug(`Server running @ ${HOST}:${PORT}`);
        });

This call will return http.Server instance which can be use for setting app variables, socket server and more.

## Documentation

You can find further information on [Sugoi official website](http://www.sugoijs.com)