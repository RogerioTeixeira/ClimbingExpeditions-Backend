import { BaseResolver } from '../../commom/base-resolver';
import { userModel , UserDocument } from '../../model/user';
import { model } from 'mongoose';

export default class UserResolver extends BaseResolver<UserDocument> {
  constructor() {
    super(userModel);
  }

  public async findOneByUid(uid: string): Promise<any> {
    return await this.findOne({ uid: uid });
  }

  public async findOneByEmail(email: string): Promise<any> {
    return await this.findOne({ email: email });
  }
}
