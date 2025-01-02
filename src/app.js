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
		res.status(400).send("Error saving the user: " + err.message);
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
	console.log(userId);
	try {
		const user = await User.findByIdAndDelete(userId);
		res.send("User deleted successfully");
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//Update a user
app.patch("/user/:userId", async (req, res) => {
	const data = req.body;
	const userId = req.params?.userId;
	try {
		const ALLOWED_UPDATES = ["profileUrl", "about", "gender", "age", "skills"];
		const isUpdateAllowed = Object.keys(data).every((key) =>
			ALLOWED_UPDATES.includes(key)
		);
		if (!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}
		if (data?.skills.length > 10) {
			throw new Error("Skills should not be more than 10");
		}
		const user = await User.findByIdAndUpdate(userId, data, {
			returnDocument: "after",
			runValidators: true,
		});
		res.send("User Updated successfully");
	} catch (err) {
		res.status(400).send("Something went wrong: " + err.message);
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
