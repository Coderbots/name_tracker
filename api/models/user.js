const mongoose = require('mongoose');
const schema = mongoose.Schema;

let user = new schema({
	person_name: {
		type: String
	},
	freq_count: {
		type: Number
	},
	req_time: {
		type: Date
	}
	},{
		collection:'user'
	}	
);

module.exports = mongoose.model('user',user);