const express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	mongoose = require('mongoose'),
	config = require('./DB');

const userRoute = require('./routes/user.route');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true}).then(
	() => { console.log("Successfully connected to Database")},
	err => { console.log('Cannot connect to Database ' + err) }
);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/users',userRoute);
let port = process.env.PORT || 4000;

const server = app.listen(port, ()=> {
	console.log("Listening on port " + port);
});

module.exports = server;