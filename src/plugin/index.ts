import * as Hapi from 'hapi';
import Logger from '../helpers/logger';
import winston from 'winston';
import goodWinston from 'hapi-good-winston';
import authFirebase from './firebase';
import mongoosePlugIn from './mongoose';
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
/*import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';*/

const goodWinstonOptions = {
  levels: {
    response: 'info',
    log: 'info',
    error: 'error',
    request: 'info'
  }
};

const options = {
  includes: {
    request: ['payload'],
    response: ['payload']
  },
  reporters: {
    winston: [
      {
        module: 'hapi-good-winston',
        name: 'goodWinston',
        args: [Logger, goodWinstonOptions]
      }
    ]
  }
};

export default class Plugins {
  public static async good(server: Hapi.Server): Promise<Error | any> {
    try {
      await Plugins.register(server, { plugin: require('good'), options });
    } catch (error) {
      Logger.error(
        `Plugins - Ups, something went wrong when registering good plugin: ${error}`
      );
      throw error;
    }
  }

  public static async firebase(server: Hapi.Server): Promise<Error | any> {
    try {
      await Plugins.register(server, { plugin: authFirebase });
      server.auth.strategy('default', 'firebase');
    } catch (error) {
      Logger.error(
        `Plugins - Ups, something went wrong when registering firebase plugin: ${error}`
      );
      throw error;
    }
  }

  public static async mongoose(server: Hapi.Server): Promise<Error | any> {
    try {
      const options = {
        promises: 'bluebird',
        uri: process.env.MONGODB_URI
      };

      await Plugins.register(server, { plugin: mongoosePlugIn, options });
    } catch (error) {
      Logger.error(
        `Plugins - Ups, something went wrong when registering mongoose plugin: ${error}`
      );
      throw error;
    }
  }

  public static async swagger(server: Hapi.Server): Promise<Error | any> {
    try {
      const swaggerOptions = {
        info: {
          title: 'Test API Documentation',
          version: 1.0
        }
      };

      await Plugins.register(server, [Inert, Vision , { plugin: HapiSwagger, swaggerOptions }]);

    } catch (error) {
      Logger.error(
        `Plugins - Ups, something went wrong when registering mongoose plugin: ${error}`
      );
      throw error;
    }
  }

  public static async registerAll(server: Hapi.Server): Promise<Error | any> {
    await Plugins.good(server);
    await Plugins.firebase(server);
    await Plugins.mongoose(server);
    await Plugins.swagger(server);
  }

  private static register(
    server: Hapi.Server,
    plugin: any
  ): Promise<Error | any> {
    return new Promise((resolve, reject) => {
      server
        .register(plugin)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }
}
