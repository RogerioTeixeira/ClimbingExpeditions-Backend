import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import server from '../src/server';
import * as mongo from 'mongoose';
import { userModel } from '../src/model/user';

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();
const body = {
  email: 'rogerio.teixeira@hotmail.it',
  password: 'xrte1982',
  returnSecureToken: true
};

let token;
let id;

describe('Test user router', () => {
  before(function(done) {
    userModel
      .deleteOne({ email: body.email })
      .then(res => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('recupera token', function(done) {
    chai
      .request('https://www.googleapis.com')
      .post(
        '/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDqiX92YmsdEUT69P7Et_ZWJB0YWoQ5jBw'
      )
      .type('json')
      .send(body)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        token = res.body.idToken;
        done();
      });
  });
  it('crea utente', function(done) {
    server._instance
      .inject({
        method: 'POST',
        url: '/api/users',
        headers: { authorization: 'bearer ' + token },
        payload: { name: 'rogerio' }
      })
      .then(res => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.json;
        const payload = JSON.parse(res.payload)
        expect(payload).to.include.keys('data');
        expect(payload.data).to.include.keys('email', 'id');
        expect(payload.data.email).to.be.an('string');
        expect(payload.data.id).to.be.an('string');
        id = payload.data.id
        done()
        
      });
  });
  it('crea utente doppio', function(done) {
    server._instance
      .inject({
        method: 'POST',
        url: '/api/users',
        headers: { authorization: 'bearer ' + token },
        payload: { name: 'rogerio' }
      })
      .then(res => {
        expect(res.statusCode).to.equal(400);
        expect(res).to.be.json;
        done()
        
      });
  });

  it('Recupera utente tramite id', function(done) {
    server._instance
      .inject({
        method: 'GET',
        url: '/api/users/' + id,
        headers: { authorization: 'bearer ' + token },
      })
      .then(res => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.json;
        const payload = JSON.parse(res.payload)
        expect(payload).to.include.keys('data');
        expect(payload.data).to.include.keys('email', 'id');
        expect(payload.data.email).to.be.an('string');
        expect(payload.data.id).to.be.an('string');
        done()
        
      })
      .catch(err =>{
        done(err)
      });
  });
  it('Recupera utente corrente', function(done) {
    server._instance
      .inject({
        method: 'GET',
        url: '/api/users/me',
        headers: { authorization: 'bearer ' + token },
      })
      .then(res => {
        console.log('header:', res.headers)
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.json;
        const payload = JSON.parse(res.payload)
        expect(payload).to.include.keys('data');
        expect(payload.data).to.include.keys('email', 'id');
        expect(payload.data.email).to.be.an('string');
        expect(payload.data.id).to.be.an('string');
        done()
        
      })
      .catch(err =>{
        done(err)
      });
  });
});
