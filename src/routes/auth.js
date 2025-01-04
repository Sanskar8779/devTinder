const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const express = require("express");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;
