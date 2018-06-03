import * as Joi from 'joi';

export default {
  request: {
    create: {
      payload: {
        name: Joi.string().required()
      }
    },
    getById: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  response: {
    user: Joi.object({
      statusCode:Joi.number().required(),   
      data: {
        id: Joi.string().required(),
        email: Joi.string().required(),
        name:Joi.string(),
        lastSignin:Joi.date().required()
      }
    })
  }
};
