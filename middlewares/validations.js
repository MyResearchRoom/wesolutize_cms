const { check, validationResult, body } = require("express-validator");

const userValidation = [
  check("email")
    .notEmpty()
    .withMessage(" Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage("Password must contain at least one letter and one number"),
];

const testimonialValidations = [
  body("name").notEmpty().withMessage("Name is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("review").notEmpty().withMessage("Review is required"),
];

const newsValidations = [
  body("title").notEmpty().withMessage("Title is required"),
  body("url")
    .notEmpty()
    .withMessage("Url is required")
    .isURL()
    .withMessage("Invalid url"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date"),
];

const productValidations = [
  body("title").notEmpty().withMessage("Title is required"),
  body("subTitle").notEmpty().withMessage("Sub title is required"),
  body("description").notEmpty().withMessage("Description is required"),
];

const partnerValidations = [
  body("title").notEmpty().withMessage("Title is required"),
];

const partnershipValidations = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isString()
    .withMessage("First name must be a string."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  check("contact")
    .notEmpty()
    .withMessage("Contact is required.")
    .isNumeric()
    .withMessage("Contact must contain only numbers.")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact must be between 10 and 15 digits."),
];

const quoteValidations = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isString()
    .withMessage("First name must be a string."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  check("contact")
    .notEmpty()
    .withMessage("Contact is required.")
    .isNumeric()
    .withMessage("Contact must contain only numbers.")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact must be between 10 and 15 digits."),
  check("city")
    .notEmpty()
    .withMessage("City is required.")
    .isString()
    .withMessage("City must be a string."),
  check("budget").notEmpty().withMessage("Budget is required."),
];

const contactValidations = [
  check("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  check("contact")
    .notEmpty()
    .withMessage("Contact is required.")
    .isNumeric()
    .withMessage("Contact must contain only numbers.")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact must be between 10 and 15 digits."),
  check("message")
    .notEmpty()
    .withMessage("Message is required.")
    .isString()
    .withMessage("Message must be a string."),
];

const chargerlocationValidations = [
  body("chargingStation")
    .notEmpty()
    .withMessage(" Charging Station is required"),
  body("chargerType")
    .notEmpty()
    .withMessage("Charger Type is required")
    .isArray()
    .withMessage(" Charger Type must be an array"),
  body("location").notEmpty().withMessage("Location is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("googleMapLink")
    .notEmpty()
    .withMessage(" Google Map Link is required")
    .isURL()
    .withMessage(" Invalid URL"),
];

const faqCategoryValidation = [
  check("title").notEmpty().withMessage(" Title is required"),
];

const faqsValidation = [
  check("faqs")
    .notEmpty()
    .withMessage("Faq's are required")
    .isArray()
    .withMessage("Faqs must be an array"),

  check("faqcategoryId").notEmpty().withMessage("FAQ category is required"),
];

const faqValidation = [
  check("question").notEmpty().withMessage("Question is required"),
  check("answer").notEmpty().withMessage("Answer is required"),
];

const blogValidations = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidation,
  testimonialValidations,
  newsValidations,
  partnerValidations,
  productValidations,
  contactValidations,
  quoteValidations,
  partnershipValidations,
  chargerlocationValidations,
  faqCategoryValidation,
  faqsValidation,
  faqValidation,
  blogValidations,
  validate,
};
