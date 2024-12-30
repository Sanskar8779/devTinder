const authAdmin = (req, res, next) => {
	const token = "xyz";
	console.log("Auth of admin being checked");
	const isAuthorized = token === "xyz";
	if (!isAuthorized) {
		res.status(401).send("Unauthorized");
	} else {
		next();
	}
};

const userAdmin = (req, res, next) => {
	const token = "xyz";
	console.log("Auth of user being checked");
	const isAuthorized = token === "aaa";
	if (!isAuthorized) {
		res.status(401).send("Unauthorized");
	} else {
		next();
	}
};

module.exports = {
	authAdmin,
	userAdmin,
};
