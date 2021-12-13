const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/athuntication', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({
  	extended: true
   }));

// app.post('/api/change-password', async (req, res) => {
// 	const { token, newpassword: plainTextPassword } = req.body

// 	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
// 		return res.json({ status: 'error', error: 'Invalid password' })
// 	}

// 	if (plainTextPassword.length < 5) {
// 		return res.json({
// 			status: 'error',
// 			error: 'Password too small. Should be atleast 6 characters'
// 		})
// 	}

// 	try {
// 		const user = jwt.verify(token, JWT_SECRET)

// 		const _id = user.id

// 		const password = await bcrypt.hash(plainTextPassword, 10)

// 		await User.updateOne(
// 			{ _id },
// 			{
// 				$set: { password }
// 			}
// 		)
// 		res.json({ status: 'ok' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: ';))' })
// 	}
// })

app.post('/auth/login', async (req, resp) => {
	const {  email : Email , password : plaintextpass} = req.body
	const user = await User.findOne({ Email }).lean()
	
	if (!user) {
		return res.json({ status: 'error', error: 'Email not registered Yet' })
	}
		let passnow =  await bcrypt.hash(plaintextpass, 10)
		console.log(user.password)
		console.log(passnow)


		await bcrypt.compare(plaintextpass, user.password, (err, res) => {
			if (err) res.json(err.message);
			if (!res) {console.log(res); 
			return resp.json({status : 400 , data : "invalid password"});}

			
			console.log("login successful!")
			const token = jwt.sign(
				{
					id: user._id,
					Email: user.Email
				},
				JWT_SECRET
	
			)
				console.log(token)
			return resp.json({ status: 'ok' , data: token})



		   });
})

app.post('/auth/signup', async (req, res) => {
	console.log("body")
	console.log(req.body)
	const { email : Email , password : plaintextpass , confirmpassword : cpass , userid: usid } = req.body
	const password = await bcrypt.hash(plaintextpass, 10)
	try {
		const response = await User.create({
			Email,
			password,
			usid,
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		// if (error.code === 11000) {
		// 	// duplicate key
		// 	return res.json({ status: 'error', error: 'Userid already in use' })
		// }
		//throw error
		if (error) {
			console.log(error.message)
			return res.json({ status: 'error', error: 'Userid already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})


app.listen(9999, () => {
	console.log('Server up at 9999')
})
