const { userAuth } = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validation");

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

module.exports = profileRouter;
