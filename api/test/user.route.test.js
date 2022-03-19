let sinon = require('sinon');
let proxyquire = require('proxyquire');
let supertest = require('supertest');
let expect = require('chai').expect;
let express = require('express');
let User = require('../models/user');
let bodyParser = require('body-parser');

describe('GET /mostrecent', () => {
	var app, request, route;

	beforeEach(() => {

		var modelstub = sinon.mock();

		var mockFindOne = {
		    sort: function () {
		       		return this;
		    },
		    limit: function () {
		        	return this;
		    },
		    select: sinon.stub().resolves({'person_name':'Test1'})
		    
		};

		sinon.stub(User, 'find').returns(mockFindOne);

		
		app = express();
		app.use(bodyParser.json());
		route = proxyquire('../routes/user.route.js', {
	      '../models/user': modelstub
		
	    });
	 	
		//route(app);
		app.get('/mostrecent',route);
		
		request = supertest(app);
	});

	afterEach(function() {
    // runs after each test in this block
    	User.find.restore();

 	 });

	it('should respond with 200',(done) => {

		request.get('/mostrecent')
				.expect(200, function (err, res) {
						//console.log(res.body);
						expect(res.body).to.deep.equal({'person_name':'Test1'});
						done();
				});
	});
});

describe('POST /save', () => {
	var app, request, route, setFreqCount, setReqTime;

	beforeEach(() => {

		var modelstub = sinon.mock();

		sinon.stub(User, 'findOneAndUpdate').resolves({});
		sinon.stub(User.prototype, 'get').resolves({});


		setFreqCount = sinon.stub(User.prototype, 'freq_count').set((val) => {
			this.freq_count = val;
		});

		setReqTime = sinon.stub(User.prototype, 'req_time').set((val) => {
			this.req_time = val;
		});

		let dummyuser = sinon.mock(User.prototype);
		
				
		dummyuser.expects('save')
				.once()
				.resolves({'person_name':'Test_2'});

		app = express();
		app.use(bodyParser.json()); //if this is not present, express req.body is undefined
		route = proxyquire('../routes/user.route.js', {
	      '../models/user': modelstub
		
	    });
	    app.post('/save', route);


	    request = supertest(app);
	});

	afterEach(function() {
    // runs after each test in this block
    	User.findOneAndUpdate.restore();
    	User.prototype.save.restore();
    	User.prototype.get.restore();
    	setFreqCount.restore();
    	setReqTime.restore();
 	 });

	describe('POST without body to /save', () => {
		it('should respond with 400',(done) => {

		request.post('/save')
				.send()
				.set('Accept', 'application/json')
				.expect(400, function (err, res) {
						//console.log(res.body);
						expect(res.body).to.deep.equal('Request body cannot be empty');
						done();
				});
		});
	});
	
	describe('POST with body to /save', () => {
		it('should respond with 200',(done) => {

		request.post('/save')
				.send({'person_name': 'Test_2'})
				.set('Accept', 'application/json')
				.expect(200, function (err, res) {
						//console.log(res.body);
						expect(res.body).to.deep.equal('Added user');
						done();
				});
		});
	});

	describe('POST with no name in body to /save', () => {
		it('should respond with 400',(done) => {

		request.post('/save')
				.send({'person_name': ''})
				.set('Accept', 'application/json')
				.expect(400, function (err, res) {
						//console.log(res.body);
						expect(res.body).to.deep.equal('Person\'s name cannot be empty');
						done();
				});
		});
	});

	// TODO: Check usernames entered fulfill the required format
});

describe('GET /', () => {
	var app, request, route;

	beforeEach(() => {

		var modelstub = sinon.mock();
		var mockFindOne = {
		    sort: function () {
		       		return this;
		    },
		    limit: function () {
		        	return this;
		    },
		    select: sinon.stub().resolves({'person_name':'Test2'})
		    
		};

		sinon.stub(User, 'find').returns(mockFindOne);
		app = express();
		app.use(bodyParser.json()); //if this is not present, express req.body is undefined
		route = proxyquire('../routes/user.route.js', {
	      '../models/user': modelstub
		
	    });
	    app.get('/', route);


	    request = supertest(app);
	});

	afterEach(function() {
    	User.find.restore();

 	 });

	describe('GET to / to return top 5 inserted names', () => {
		it('should respond with 200', (done) => {

			request.get('/')
					.expect(200, function (err, res) {
						expect(res.body).to.deep.equal({'person_name':'Test2'});
						done();
				});
		});
	});

})

// TODO: Add more tests
