const mongoose = require("mongoose");
const validator = require("validator");

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
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid Email: " + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Enter a strong password: " + value);
				}
			},
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
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error("Invalid URL: " + value);
				}
			},
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
