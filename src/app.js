const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

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
		const isCorrect = await bcrypt.compare(password, user.password);
		if (!isCorrect) {
			throw new Error("Invalid credentials");
		}

		//create jwt token
		const token = jwt.sign({ _id: user._id }, "dev@Tinder790");

		//everything good
		res.cookie("token", token);
		res.send("Login successful");
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

app.get("/profile", async (req, res) => {
	try {
		//validate jwt token
		const { token } = req.cookies;
		if (!token) {
			throw new Error("Invalid Token");
		}
		const decodedMsg = jwt.verify(token, "dev@Tinder790");
		const user = await User.findById({ _id: decodedMsg._id });
		if (!user) {
			throw new Error("User not found");
		}
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

//Get one user by email
app.get("/user", async (req, res) => {
	const userEmail = req.body.email;

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			res.status(404).send("User not found");
		} else {
			res.send(user);
		}
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//Get all users
app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({});
		if (users.length === 0) {
			res.status(404).send("Users not found");
		} else {
			res.send(users);
		}
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//Delete a user
app.delete("/user", async (req, res) => {
	const userId = req.body.userId;
	try {
		const user = await User.findByIdAndDelete(userId);
		res.send("User deleted successfully");
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//Update a user
app.patch("/user/:userId", async (req, res) => {
	const userId = req.params?.userId;
	const data = req.body;
	try {
		const ALLOWED_UPDATES = ["profileUrl", "about", "gender", "age", "skills"];
		const isUpdateAllowed = Object.keys(data).every((key) =>
			ALLOWED_UPDATES.includes(key)
		);
		if (!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}
		// if (data?.skills.length > 10) {
		// 	throw new Error("Skills should not be more than 10");
		// }
		const user = await User.findByIdAndUpdate(userId, data, {
			returnDocument: "after",
			runValidators: true,
		});
		res.send("User Updated successfully");
	} catch (err) {
		res.status(400).send("Update Failed: " + err.message);
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
