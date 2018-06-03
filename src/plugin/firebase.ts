import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as firebaseAdmin from 'firebase-admin';

export class FirebaseScheme implements Hapi.ServerAuthSchemeObject {
  public static instance(server: Hapi.Server, options?: Hapi.ServerAuthSchemeOptions): Hapi.ServerAuthSchemeObject {
    return new FirebaseScheme();
  }

  async authenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    if (request.headers.authorization && request.headers.authorization !== undefined) {
      const headerParts = request.headers.authorization.split(' ');

      if (headerParts[0].toLowerCase() !== 'bearer') {
        throw Boom.unauthorized(null, 'default');
      }
      try {
        const cred = await this.verifyToken(headerParts[1])
        return h.authenticated({ credentials: cred });
      } catch (error) {
        throw Boom.unauthorized(null, 'default');
      }



    } else {
      throw Boom.unauthorized(null, 'default');
    }



  }

  verifyToken(token: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return firebaseAdmin
      .auth()
      .verifyIdToken(token);
  }
}

export class FirebasePlugin {
  name = 'firebase';
  version = '1.0.1';

  async register(server: Hapi.Server, options) {
    server.auth.scheme('firebase', FirebaseScheme.instance);
  }
}

export default new FirebasePlugin();
