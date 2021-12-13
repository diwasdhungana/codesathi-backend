const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		Email: { type: String, index : true ,unique: true },
		password: { type: String},
		usid : { type: String, index : true,  unique: true }
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model
