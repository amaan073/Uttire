import { body, validationResult } from "express-validator";

// Middleware to handle validation result
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for register
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Only letters allowed")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").isEmail().withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  handleValidationErrors,
];

// Validation rules for login
export const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];
