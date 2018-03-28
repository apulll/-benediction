/*
* @Author: perry
* @Date:   2018-03-16 11:10:35
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:40:10
*/
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
	// Build your resulting errors however you want! String, object, whatever - it works!
	return `${location}[${param}]: ${msg}`;
};

const validatorForm = function(req) {
	const errors = validationResult(req).formatWith(errorFormatter);

	return errors;
};

export default validatorForm;
