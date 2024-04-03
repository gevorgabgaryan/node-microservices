import Tracing from './lib/tracing';
import Config from './config';

(async () => {
    await Tracing(`${Config.serviceName}:${Config.serviceVersion}`);
    const logger = (await import('./shared/logger')).default;
    const API = (await import('./API/API')).default;

    try {
        const apiServer = await API.init();
    } catch (e) {
        console.error(e);
        logger.error(e);
    }
})();