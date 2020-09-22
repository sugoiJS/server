import {ISecurityConfiguration} from "../interfaces/security.interface";
import {ConfigurationTypes, getConfiguration} from "../index";
import helmet = require("helmet");

const DEFAULT_HELMET_CONFIGURATION:ISecurityConfiguration = {
	enabled: true,
	options: undefined
};

export function applySecurityMiddleware(app) {
    const configuration = getConfiguration(ConfigurationTypes.security, DEFAULT_HELMET_CONFIGURATION);
    if(configuration && configuration.enabled){
        app.use(helmet(configuration.options))
    }
}
