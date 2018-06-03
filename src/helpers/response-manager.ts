import * as  Hoek from 'hoek';
import * as mongoose from 'mongoose';




export class ResponseManager {
    
  public static ResponseWithData(data: any) { 
    return {
      statusCode: 200,
      data: data.toJSON ? data.toJSON() : data
    };
  }
}
