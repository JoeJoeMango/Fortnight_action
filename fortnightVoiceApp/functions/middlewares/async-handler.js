'use strict';

// Check this SO for more info:
// https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware/51391081#51391081

const asyncHandler = fn => (req, res, next) => {
	return Promise
		.resolve(fn(req, res, next))
		.catch(next);
};

module.exports = asyncHandler;
