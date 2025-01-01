const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://sanskarshubham28:sanskar@devtindercluster.wm7eo.mongodb.net/devTinderData"
	);
};

module.exports = connectDB;
