const supertest = require('supertest')
const expect = require('chai').expect
const app = require('../index')
const request = supertest(app)  

// In this test it's expected 
describe('/api/users', function () {
    it('GET /api/users with Unauthorized user returns a status code of 400', function (done) {
        request.get('/api/users')
            .expect(400)
            .end(function (err, res) {
                done(err);
            });
    });
});

describe('/api/auth', function() {
    it('Register user should return valid data and crypted password', function(done){
        request.post('/api/auth/register')
            .send({
              username: 'testUsername',
              firstname: 'testFirstName',
              lastname: 'testLastName',
              email: 'testEmail@test.com',
              password: 'testPassword'
            })
            .expect(201)
            .expect(function (err, res) {
              expect(res.username).to.be.equal('testUsername');
              expect(res.firstname).to.be.equal('testFirstName');
              expect(res.lastname).to.be.equal('testLastName');
              expect(res.email).to.be.equal('testEmail@test.com');
              expect(res.password).to.not.be.equal('testPassword');
              done(err);
            })
            .end(function (err, res) {
              done(err);
            });
    });

    it('Registered user should be able to login', function(done){
      request.post('/api/auth/login')
          .send({
            email: 'testEmail@test.com',
            password: 'testPasswod'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
              expect(res.username).to.be.equal('testUsername');
              expect(res.firstname).to.be.equal('testFirstName');
              expect(res.lastname).to.be.equal('testLastName');
              expect(res.email).to.not.be.equal('testEmail@test.com');
              expect(res.password).to.not.be.equal('testPassword');
              done(err);
          });
  });
});

/*
describe('', function() {
    it('', function(){
        request.METHOD(URL)
            .expect(STATUSCODE)
            .end(function (err, res) {
                expect(res.body.ATTRIBUTE).to.be.equal(SOMETHNG);
                done(err);
            });
    });
});
*/