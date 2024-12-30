const express = require("express");

const app = express();

app.use("/test", (req, res) => {
	res.send("Server working");
});

app.get("/user/:userId/:name", (req, res) => {
	console.log(req.params);
	res.send({ firstName: "Sanskar", lastName: "Shubham" });
});

app.post("/user", (req, res) => {
	res.send({ message: "User created" });
});

app.delete("/user", (req, res) => {
	res.send({ message: "User deleted" });
});
app.listen(4000, () => {
	console.log("Server is running on port 4000");
});
