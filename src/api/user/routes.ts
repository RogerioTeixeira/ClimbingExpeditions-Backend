import * as Hapi from 'hapi';
import Logger from '../../helpers/logger';
import { promises } from 'fs';
import UserController from './controller';
import validate from './validate';
import { Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';


const test :Hapi.RouteOptionsPreObject = {method:function (request: Request, respose: ResponseToolkit):any{return 'pluto'} , assign : 'pippo'}

export default class UserRoutes {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise(resolve => {
      const controller = new UserController();
      server.route([
        {
          method: 'post',
          path: '/api/users',
          options: {
            handler: controller.create,
            validate: validate.request.create,
            auth: 'default'
          }
        },
        {
          method: 'get',
          path: '/api/users/{id}',
          options: {
            handler: controller.getById,
            validate: validate.request.getById,
            auth: 'default',
            response:{
              schema: validate.response.user,
              modify: true,
              options: {
                stripUnknown: true
              }

            }
          }
        },
        {
          method: 'get',
          path: '/api/users/me',
          options: {
            handler: controller.getMe,
            auth: 'default',
            response:{
              schema: validate.response.user,
              modify: true,
              options: {
                stripUnknown: true
              }

            }
          }
        }
      ]);

      resolve();
    });
  }
}
