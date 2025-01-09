const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ["ignored", "accepted", "interested", "rejected"],
				message: `{VALUE} is incorrect status type!`,
			},
		},
	},
	{ timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error("Cannot send request to yourself!");
	}
	next();
});

const connectionRequest = new mongoose.model(
	"connectionRequest",
	connectionRequestSchema
);

module.exports = connectionRequest;
