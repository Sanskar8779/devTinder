const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
	"/request/send/:status/:userId",
	userAuth,
	async (req, res) => {
		//toUserId and fromUserId
		try {
			const toUserId = req.params.userId;
			const fromUserId = req.user._id;
			const status = req.params.status;

			//while swipping only ignored and interested can be status
			const allowedStatus = ["ignored", "interested"];
			if (!allowedStatus.includes(status)) {
				throw new Error("Invalid status type!");
			}

			//cannot send request to non-existing user
			const toUser = await User.findById(toUserId);
			if (!toUser) {
				throw new Error("User not found!");
			}

			//Checks if connection exists b/w A->B or B->A
			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId: fromUserId, toUserId: toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});
			if (existingConnectionRequest) {
				throw new Error("Connection Request already exists!");
			}

			const connection = new ConnectionRequest({
				toUserId,
				fromUserId,
				status,
			});
			const data = await connection.save();
			res.json({
				message: "Connection sent successfully!",
				status: status,
				data: data,
			});
		} catch (err) {
			res.status(400).json("ERROR: " + err.message);
		}
	}
);

requestRouter.post(
	"/request/review/:status/:requestId",
	userAuth,
	async (req, res) => {
		try {
			// loggedInUserId === toUserId
			// status can only be interested
			// params.status can only be accepted or rejected
			// requestId should be valid
			const loggedInUser = req.user;
			const { status, requestId } = req.params;
			const allowedStatus = ["accepted", "rejected"];
			if (!allowedStatus.includes(status)) {
				throw new Error("Invalid status");
			}

			const connectionRequest = await ConnectionRequest.findOne({
				_id: requestId,
				status: "interested",
				toUserId: loggedInUser._id,
			});

			if (!connectionRequest) {
				throw new Error("Connection Request does not exist!");
			}

			connectionRequest.status = status;
			const data = await connectionRequest.save();

			res.json({
				message: "Connection successfully " + status,
				data: data,
			});
		} catch (err) {
			res.status(400).json({
				message: "ERROR: " + err.message,
			});
		}
	}
);

module.exports = requestRouter;
