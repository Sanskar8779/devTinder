const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = [
	"firstName",
	"lastName",
	"age",
	"gender",
	"about",
	"skills",
	"profileUrl",
];

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await ConnectionRequest.find({
			status: "interested",
			toUserId: loggedInUser._id,
		}).populate("fromUserId", USER_SAFE_DATA);
		res.json({
			message: "Connection requests fetched successfully!",
			data: connectionRequests,
		});
	} catch (err) {
		res.status(400).json("ERROR: " + err.message);
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connections = await ConnectionRequest.find({
			$or: [
				{ toUserId: loggedInUser._id, status: "accepted" },
				{ fromUserId: loggedInUser._id, status: "accepted" },
			],
		})
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);

		const data = connections.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
				return row.toUserId;
			}
			return row.fromUserId;
		});

		res.json({
			message: "Your connections fetched successfully",
			data: data,
		});
	} catch (err) {
		res.status(400).json({ message: "ERROR: " + err.message });
	}
});

module.exports = userRouter;
