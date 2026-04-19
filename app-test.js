let mongoose = require("mongoose");
let app = require("./app");

let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('Planets API Suite', () => {

    describe('Fetching Planet Details', () => {

        it('should fetch Mercury', (done) => {
            chai.request(app)
                .post('/planet')
                .send({ id: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                    done();
                });
        });

        it('should fetch Venus', (done) => {
            chai.request(app)
                .post('/planet')
                .send({ id: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                    done();
                });
        });

        it('should fetch Earth', (done) => {
            chai.request(app)
                .post('/planet')
                .send({ id: 3 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                    done();
                });
        });

        it('should fetch Mars', (done) => {
            chai.request(app)
                .post('/planet')
                .send({ id: 4 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                    done();
                });
        });

    });
});

// optional cleanup (good practice)
after(() => {
    mongoose.connection.close();
});
