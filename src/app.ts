import * as Hapi from 'hapi';
import * as Boom from 'boom';
import Logger from './helpers/logger';
import plugin from './plugin';
import Router from './router';
import * as DotEnv from 'dotenv';
import * as admin from 'firebase-admin';

export default class App {
  static _instance: Hapi.Server;

  public static async start(): Promise<Hapi.Server> {
    try {
      DotEnv.config({
        path: `${process.cwd()}/.env`
      });

      admin.initializeApp({
        credential: admin.credential.cert(require('../firebase.json')),
        databaseURL: "https://climbingexpeditions-177213.firebaseio.com"
      });

      App._instance = new Hapi.Server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
          cors: true
        }
      });

      await plugin.registerAll(App._instance);

      await Router.loadRoutes(App._instance);

      await App._instance.start(); 
      App._instance.log('Server', `Up and running ${App._instance.info.address}:${App._instance.info.port}`)

      return App._instance;
    } catch (error) {
      Logger.info(`[Server] There was something wrong: ${error}`);
      App.stop();
    
      throw error;
    }
  }

  public static stop(): Promise<Error | void> {
    Logger.info(`[Server] Stopping!`);
    
    return App._instance ? App._instance.stop() : null;
  }
}
