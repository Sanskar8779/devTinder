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
		res.status(200).json("User added successfully!!!");
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
		res.status(200).json({
			message: "Login successful",
			data: user,
		});
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

authRouter.post("/logout", async (req, res) => {
	res.cookie("token", null, { expires: new Date(Date.now()) });
	res.status(200).json("User logged out successfully!!!");
});

module.exports = authRouter;
