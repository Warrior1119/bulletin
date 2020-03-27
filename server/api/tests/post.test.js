/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const { some } = require('lodash');
const app = require('../../index');
const Post = require('../models/post.model');
const User = require('../models/user.model');

/**
 * root level hooks
 */

async function format(user) {
  const formated = user;

  // delete password
  delete formated.password;

  // get users from database
  const dbUser = (await User.findOne({ email: user.email })).transform();

  // remove null and undefined properties
  return dbUser;
}

describe('Users API', async () => {
  let dbUsers;
  let dbPosts;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);

  beforeEach(async () => {
    dbUsers = {
      billStark: {
        email: 'billstark@gmail.com',
        password: passwordHashed,
        name: 'Bill Stark',
      },
      donnaPolleris: {
        email: 'donnapolleris@gmail.com',
        password: passwordHashed,
        name: 'Donna Polleris',
      },
    };

    dbPosts = {
      post1: {
        title: 'Our wedding',
        body: 'I\'m getting married.',
        tags: ['wedding', 'beautiful', 'marriage']
      },
      post2: {
        title: 'Model',
        body: 'My sister is a beautiful fashion model.',
        tags: ['model', 'fashion', 'beautiful']
      },
      post3: {
        title: 'Vacation',
        body: 'Our family is planning vacation for this summer',
        tags: ['vacation', 'place']
      }
    }

    await User.deleteMany({});
    await User.insertMany([dbUsers.billStark, dbUsers.donnaPolleris]);
    await Post.deleteMany({});
    dbUsers.billStark.password = password;
    dbUsers.donnaPolleris.password = password;
    billAccessToken = (await User.findAndGenerateToken(dbUsers.billStark)).accessToken;
    donnaAccessToken = (await User.findAndGenerateToken(dbUsers.donnaPolleris)).accessToken;
  });

  describe('POST /api/posts', () => {
    it('should create a new post when request is ok', () => {
      return request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${billAccessToken}`)
        .send(dbPosts.post1)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.deep.include(dbPosts.post1);
        });
    });
  });

  describe('GET /api/posts', async () => {
    beforeEach(async () => {
      await Post.deleteMany({});
      await Post.insertMany([dbPosts.post1, dbPosts.post2, dbPosts.post3]);
    });
    
    it('should get all posts', () => {
      return request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${billAccessToken}`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          
          const includesPosts = some(res.body, dbPosts.post1) && some(res.body, dbPosts.post2) && some(res.body, dbPosts.post3);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(3);
          expect(includesPosts).to.be.true;
        });
    });

    it('should filter posts', () => {
      return request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${billAccessToken}`)
        .send({ filters: { tag: 'beautiful' } })
        .expect(httpStatus.OK)
        .then(async (res) => {
          const includesPosts = some(res.body, dbPosts.post1) && some(res.body, dbPosts.post2);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(includesPosts).to.be.true;
        });
    });

    it('should sort posts', () => {
      return request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${billAccessToken}`)
        .send({ filters: { tag: 'beautiful' } , sort: {title: 1}})
        .expect(httpStatus.OK)
        .then(async (res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0]).to.deep.include(dbPosts.post2);
          expect(res.body[1]).to.deep.include(dbPosts.post1);
        });
    });


    it('should report error if not logged in', () => {
      return request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer invalid token`)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.code).to.be.equal(httpStatus.UNAUTHORIZED);
        });
    });
  });

  describe('POST /api/posts/upvote', async () => {
    let post;
    beforeEach(async () => {
      await Post.deleteMany({});
      post = new Post(dbPosts.post1);
      post = await post.save();
    });
    
    it('should upvote post', () => {
      return request(app)
        .post(`/api/posts/${post._id}/upvote`)
        .set('Authorization', `Bearer ${billAccessToken}`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          let expectedPost = {...dbPosts.post1, upvoted: true, downvoted: false, upvotes: 1, downvotes: 0};
          expect(res.body).to.deep.include(expectedPost);
        });
    });

  });

  describe('POST /api/posts/downvote', async () => {
    let post;
    beforeEach(async () => {
      await Post.deleteMany({});
      post = new Post(dbPosts.post1);
      post = await post.save();
    });
    
    it('should upvote post', () => {
      return request(app)
        .post(`/api/posts/${post._id}/downvote`)
        .set('Authorization', `Bearer ${billAccessToken}`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          let expectedPost = {...dbPosts.post1, upvoted: false, downvoted: true, upvotes: 0, downvotes: 1};
          expect(res.body).to.deep.include(expectedPost);
        });
    });

  });

});
