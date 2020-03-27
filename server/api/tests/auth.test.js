/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const moment = require('moment-timezone');
const app = require('../../index');
const User = require('../models/user.model');

const sandbox = sinon.createSandbox();

describe('Authentication API', () => {
  let dbUser;
  let user

  beforeEach(async () => {
    dbUser = {
      email: 'branstark@gmail.com',
      password: 'mypassword',
      name: 'Bran Stark',
    };

    user = {
      email: 'test.test@gmail.com',
      password: '123456',
      name: 'Test User',
    };

  
    await User.deleteMany({});
    await User.create(dbUser);
  });

  afterEach(() => sandbox.restore());

  describe('POST /api/auth/register', () => {
    it('should register a new user when request is ok', () => {
      return request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          delete user.password;
          expect(res.body).to.have.a.property('accessToken');
          expect(res.body.user).to.include(user);
        });
    });

    it('should report error when email already exists', () => {
      return request(app)
        .post('/api/auth/register')
        .send(dbUser)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" already exists');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'invalid_email';
      return request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" must be a valid email');
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/api/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" is required');
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return an accessToken when email and password matches', () => {
      return request(app)
        .post('/api/auth/login')
        .send({ email: dbUser.email, password: dbUser.password })
        .expect(httpStatus.OK)
        .then((res) => {
          delete dbUser.password;
          expect(res.body).to.have.a.property('accessToken');
          expect(res.body.user).to.include(dbUser);
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/api/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" is required');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'invalid_email';
      return request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" must be a valid email');
        });
    });

    it("should report error when email and password don't match", () => {
      user.password = 'xxx';
      return request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          const { code } = res.body;
          const { message } = res.body;
          expect(code).to.be.equal(401);
          expect(message).to.be.equal('Incorrect email or password');
        });
    });
  });

});
