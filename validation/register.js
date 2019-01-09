const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.enterpriseId = !isEmpty(data.enterpriseId) ? data.enterpriseId : "";
  data.employeeId = !isEmpty(data.employeeId) ? data.employeeId : "";
  data.CUI = !isEmpty(data.CUI) ? data.CUI : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  // Type checks

  if (Validator.isEmpty(data.type)) {
    errors.message = "Type is required";
  }

  // ID checks

  if (Validator.isEmpty(data.enterpriseId) && data.type === "employer") {
    errors.message = "Enterprise ID is required";
  }

  if (Validator.isEmpty(data.employeeId) && data.type === "employee") {
    errors.message = "Employee ID is required";
  }

  if (Validator.isEmpty(data.CUI) && data.type === "employee") {
    errors.message = "Enterprise UIC is required";
  }

  // Email checks

  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required";
  }

  // Password checks

  if (Validator.isEmpty(data.password)) {
    errors.message = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
