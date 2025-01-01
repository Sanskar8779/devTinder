const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); //this will convert json into JS object

app.post("/signup", async (req, res) => {
	//creating an instance of USer model
	const user = new User(req.body);

	try {
		await user.save();
		res.send("User added successfully!");
	} catch (err) {
		res.status(400).send("Error saving the user", err);
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
