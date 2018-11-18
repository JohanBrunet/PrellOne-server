const supertest = require('supertest')
const expect = require('chai').expect
const app = require('../index')
const request = supertest(app)  

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