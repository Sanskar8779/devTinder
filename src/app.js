const express = require("express");

const app = express();

app.use("/profile", (req, res) => {
	res.send("Hello from profile!");
});

app.use("/connection", (req, res) => {
	res.send("Hello from connection!");
});

app.listen(7777, () => {
	console.log("Server is running on port 7777");
});
