import {IConfiguration} from "./configuration.interface";
import {
    IHelmetContentSecurityPolicyConfiguration,
    IHelmetDnsPrefetchControlConfiguration, IHelmetExpectCtConfiguration,
    IHelmetFrameguardConfiguration,
    IHelmetHidePoweredByConfiguration,
    IHelmetHpkpConfiguration,
    IHelmetHstsConfiguration, IHelmetXssFilterConfiguration
} from "helmet";

export interface ISecurityConfiguration extends IConfiguration{
    options:{
        contentSecurityPolicy?: boolean | IHelmetContentSecurityPolicyConfiguration,
        dnsPrefetchControl?: boolean | IHelmetDnsPrefetchControlConfiguration,
        frameguard?: boolean | IHelmetFrameguardConfiguration,
        hidePoweredBy?: boolean | IHelmetHidePoweredByConfiguration,
        hpkp?: boolean | IHelmetHpkpConfiguration,
        hsts?: boolean | IHelmetHstsConfiguration,
        ieNoOpen?: boolean,
        noCache?: boolean,
        noSniff?: boolean,
        xssFilter?: boolean | IHelmetXssFilterConfiguration,
        expectCt?: boolean | IHelmetExpectCtConfiguration,

    }
}