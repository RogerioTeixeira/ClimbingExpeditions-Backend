import { Request, ResponseToolkit } from 'hapi';
import * as Boom from 'boom';
import { UserDocument, UserSchema } from '../../model/user';
import { BaseController } from '../../commom/base-controller';
import UserResolver from './resolver';
import { ResponseManager } from '../../helpers/response-manager';

export default class UserController extends BaseController<UserResolver> {
  constructor() {
    super(new UserResolver());
  }
  public async getById(request: Request, r: ResponseToolkit) {
    const user = await this.resolver.findById(request.params.id)
    if(!user){
      return Boom.badRequest('userid not found');
    }
    return ResponseManager.ResponseWithData(user);
  }

  public async getMe(request: Request, r: ResponseToolkit) {
    const credentials: any = request.auth.credentials
    const user = await this.resolver.findOneByUid(credentials.uid)
    if(!user){
      return Boom.badRequest('userid not found');
    }
    return ResponseManager.ResponseWithData(user);
  }

  public async create(request: Request,respose: ResponseToolkit): Promise<any> {
    try {
      const credentials: any = request.auth.credentials;
      const payload: any = request.payload;
      const user: any = {
        name: payload.name,
        email: credentials.email,
        uid: credentials.uid
      };
      if (await this.resolver.findOneByUid(user.uid)) {
        return Boom.badRequest('user already exists');
      }
      const data = await this.resolver.save(user);
      return ResponseManager.ResponseWithData(data);
    } catch (err) {
      return Boom.badImplementation(err);
    }
  }


  public async findById(request: Request,respose: ResponseToolkit): Promise<any> {

  }
}
