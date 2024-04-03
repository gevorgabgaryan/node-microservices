import Tracing from './lib/tracing';
import Config from './config';

(async () => {
    const MongooseService = (await import('./databases/MongooseService')).default;
    const logger = (await import('./shared/logger')).default;
    const API = (await import('./API/API')).default;

    try {
        await MongooseService.init();
        await API.init();
    } catch (e) {
        console.error(e);
        logger.error(e);
    }
})();

