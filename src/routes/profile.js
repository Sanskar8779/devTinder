const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const {
	validateProfileEditData,
	validateProfilePassword,
} = require("../utils/validation");

const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		const isValidatedToEdit = validateProfileEditData(req);
		if (!isValidatedToEdit) {
			throw new Error("Invalid Edit Fields!!");
		}
		const loggedInUser = req.user;
		Object.keys(req.body).forEach(
			(field) => (loggedInUser[field] = req.body[field])
		);
		await loggedInUser.save();

		res.status(200).json({
			message: `${loggedInUser.firstName} , your profile updated successfully!`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).json("ERROR: " + err.message);
	}
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
	try {
		const isValidatedToEdit = validateProfilePassword(req);
		if (!isValidatedToEdit) {
			throw new Error("Cannot change password, try entering a strong one!!");
		}
		const loggedInUser = req.user;
		const enteredPassword = req.body.password;
		loggedInUser.password = await bcrypt.hash(enteredPassword, 10);
		await loggedInUser.save();

		res.status(200).json({
			message: `${loggedInUser.firstName}, your password updated successfully!`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).json("ERROR: " + err.message);
	}
});

module.exports = profileRouter;
