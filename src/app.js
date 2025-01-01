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
