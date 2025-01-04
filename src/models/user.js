const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			maxLength: 50,
		},
		lastName: {
			type: String,
			required: true,
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

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, "dev@Tinder790", {
		expiresIn: "1d",
	});
	return token;
};

userSchema.methods.validatePassword = async function (enteredPassword) {
	const user = this;
	const isValidated = await bcrypt.compare(enteredPassword, user.password);
	return isValidated;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
