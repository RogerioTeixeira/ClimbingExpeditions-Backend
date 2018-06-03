import * as Hapi from 'hapi';

import UserRoutes from './api/user/routes';
import Logger from './helpers/logger';

export default class Router {
    static routerManager = new UserRoutes();
    public static async loadRoutes(server: Hapi.Server): Promise<any> {
        await Router.routerManager.register(server);
    }
}