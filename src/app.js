const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
	const user = new User({
		firstName: "Sanskar",
		lastName: "Shubham",
		email: "sanskar@shubham.com",
		password: "sanskar",
		age: 23,
	});

	try {
		await user.save();
		res.send("User added successfully!");
	} catch (err) {
		res.status(400).send("Error saving the user", err);
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
