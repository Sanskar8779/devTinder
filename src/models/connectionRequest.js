const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
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
