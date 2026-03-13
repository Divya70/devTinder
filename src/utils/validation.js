const validator = require("validator");

const ValidateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedUpdates.includes(field),
  );
  return isEditAllowed;
};

module.exports = { ValidateSignupData, validateProfileEditData };
