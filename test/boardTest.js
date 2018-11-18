const supertest = require('supertest')
const expect = require('chai').expect
const app = require('../index')
const request = supertest(app)  

// In this test it's expected 
describe('/api/boards', function () {
    it('GET /api/boards with Unauthorized user returns a status code of 400', function (done) {
        request.get('/api/boards')
            .expect(400)
            .end(function (err, res) {
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