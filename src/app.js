const express = require("express");
const { authAdmin, userAdmin } = require("./middleware/auth");

const app = express();

// app.use("/admin", authAdmin);
app.use("/user/login", (req, res) => {
	res.send("User login page");
});

app.get("/user", userAdmin, (req, res) => {
	res.send("User data");
});

app.get("/admin/getAllData", authAdmin, (req, res) => {
	res.send("All data of admin");
});

app.get("/admin/deleteUser", authAdmin, (req, res) => {
	res.send("User deleted");
});

app.use("/test", (req, res) => {
	try {
		throw new Error("Erooorror");
		res.send("test route");
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.use("/", (err, req, res, next) => {
	res.status(500).send("Something went wrong");
});

app.listen(7777, (req, res) => {
	console.log("Server is running on port 4000");
});
