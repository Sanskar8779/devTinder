const express = require("express");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

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
			const existingConnectionRequest = await connectionRequest.findOne({
				$or: [
					{ fromUserId: fromUserId, toUserId: toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});
			if (existingConnectionRequest) {
				throw new Error("Connection Request already exists!");
			}

			const connection = new connectionRequest({
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

module.exports = requestRouter;
