const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			maxLength: 50,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data not valid!!!");
				}
			},
		},
		profileUrl: {
			type: String,
			default: "https://geographyandyou.com/images/user-profile.png",
		},
		about: {
			type: String,
			default: "This is the default description of user.",
		},
		skills: {
			type: [String],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
