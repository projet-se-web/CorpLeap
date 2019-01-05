const Validator = require('validator');
const isEmpty = require('is-empty');
module.exports = function validateRegisterInput(data) {
  let errors = {};
  console.error(data);
  // Convert empty fields to an empty string so we can use validator functions

  data.enterpriseId = !isEmpty(data.enterpriseId) ? data.enterpriseId : '';
  data.type = !isEmpty(data.type) ? data.type : null;
  data.password = !isEmpty(data.password) ? data.password : '';
  // data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Type checks

  if (Validator.isEmpty(data.type)) {
    errors.type = 'Type is required';
  }

  // ID checks

  if (Validator.isEmpty(data.enterpriseId) && data.type === "employee") {
    errors.enterpriseId = 'Enterprise ID is required';
  }

  // Email checks

  // if (Validator.isEmpty(data.email)) {
  //   errors.email = 'Email field is required';
  // } else if (!Validator.isEmail(data.email)) {
  //   errors.email = 'Email is invalid';
  // }

  // Password checks

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = 'Confirm password field is required';
  // }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = 'Passwords must match';
  // }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};