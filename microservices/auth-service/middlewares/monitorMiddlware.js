import monitor from 'express-status-monitor';
import basicAuth from 'express-basic-auth';
import config from '../config';


export function monitorMiddleware() {
    const statusMonitorMiddleware = monitor();

    const basicAuthMiddleware = config.monitor.user && config.monitor.password
        ? basicAuth({
            users: { [config.monitor.user]: config.monitor.password },
            challenge: true,
        })
        : (req, res, next) => next();

    function serveStatusPageMiddleware(req, res, next) {
        if (req.path === (config.monitor.route || '/status')) {
            basicAuthMiddleware(req, res, () => statusMonitorMiddleware.pageRoute(req, res, next));
        } else {
            next();
        }
    }

    return [statusMonitorMiddleware.middleware, serveStatusPageMiddleware];
}
