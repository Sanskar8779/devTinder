const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json()); //this will convert json into JS object
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
