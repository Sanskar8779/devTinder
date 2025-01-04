const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json()); //this will convert json into JS object
app.use(cookieParser());

//signup
app.post("/signup", async (req, res) => {
	//Validate the user
	try {
		validateSignupData(req);

		const { firstName, lastName, email, password } = req.body;
		//Encrypt the password
		const passwordHash = await bcrypt.hash(password, 10);

		//creating an instance of USer model
		const user = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
		});

		await user.save();
		res.send("User added successfully!");
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

//login
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		//check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("Invalid credentials");
		}
		//check if password correct
		const isCorrect = await user.validatePassword(password);
		if (!isCorrect) {
			throw new Error("Invalid credentials");
		}
		const token = await user.getJWT();

		//everything good
		res.cookie("token", token);
		res.send("Login successful");
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

app.get("/profile", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(7777, (req, res) => {
			console.log("Server is running on port 7777");
		});
	})
	.catch((err) => {
		console.log("Error connecting to database", err);
	});
