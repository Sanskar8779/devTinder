const validator = require("validator");

const validateSignupData = (req) => {
	const { firstName, lastName, email, password } = req.body;
	if (!firstName || !lastName || !email || !password) {
		throw new Error("All fields are required!");
	} else if (!validator.isEmail(email)) {
		throw new Error("Enter a valid email!");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Enter a strong password!");
	}
};

const validateProfileEditData = (req) => {
	const allowedEdits = [
		"firstName",
		"lastName",
		"email",
		"age",
		"gender",
		"skills",
		"about",
		"profileUrl",
	];
	const isEditAllowed = Object.keys(req.body).every((field) =>
		allowedEdits.includes(field)
	);
	return isEditAllowed;
};

module.exports = {
	validateSignupData,
	validateProfileEditData,
};
