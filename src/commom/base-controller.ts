import { Model, Document } from 'mongoose'
import { Request, ResponseToolkit } from 'hapi';
import { BaseResolver } from './base-resolver';
import * as Boom from 'boom';
import {UserDocument} from '../model/user'
const autoBind = require('auto-bind');

export abstract class BaseController<T extends BaseResolver<UserDocument>>{

    constructor(protected resolver: T) { 
        autoBind(this);
    }

    async create(request: Request, respose: ResponseToolkit): Promise<any>{
        return Boom.badImplementation('method create not implemented')
    };

    async deleteById(request: Request, respose: ResponseToolkit): Promise<any>{
        return Boom.badImplementation('method deleteById not implemented')
    };

    async updateById(request: Request, respose: ResponseToolkit): Promise<any>{
        
        return Boom.badImplementation('method updateById not implemented')
    };

    async getById(request: Request, respose: ResponseToolkit): Promise<any>{
        
        return Boom.badImplementation('method getById not implemented')
    };
    


}