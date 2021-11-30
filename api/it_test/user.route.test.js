let server = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let User = require("../models/user");
let sinon = require("sinon");

chai.should();
chai.use(chaiHttp);

describe("Test APIs", () => {
  describe("with mock: Test /save", () => {
    it("Should save user and respond with 200 status code", (done) => {
      let userMock = sinon.mock(User);
      //const users = [{"person_name":"Test1", "freq_count":1,"req_time":"2021-11-21T16:20:00.194Z"}];
      userMock.expects("findOneAndUpdate").once().resolves(null);

      let dummyuser = sinon.mock(User.prototype);

      dummyuser.expects("save").once().resolves({});

      chai
        .request(server)
        .post("/user/save")
        .send({})
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });
  describe("Test GET top5 names route", () => {
    it("Should return 5 most pushed names", (done) => {
      chai
        .request(server)
        .get("/user/")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          response.body.length.should.not.be.eq(0);
          done();
        });
    });
  });

  describe("Test most recent inserted name", () => {
    it("Should return most return name", (done) => {
      chai
        .request(server)
        .get("/user/mostrecent")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          response.body.length.should.not.be.eq(0);
          done();
        });
    });
  });
});
