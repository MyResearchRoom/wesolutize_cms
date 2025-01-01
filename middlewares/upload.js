const multer = require("multer");

const profileImageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type for ${file.fieldname}. Only image files are allowed.`
    );
    error.name = "InvalidFileError";
    error.statusCode = 400; // Set the status code
    cb(error);
  }
};

const brochureFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type for ${file.fieldname}. Only PDF is allowed.`
    );
    error.name = "InvalidFileError";
    error.statusCode = 400;
    cb(error);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Dynamically handle validation based on the fieldname
    if (file.fieldname === "profile") {
      profileImageFilter(req, file, cb, file.fieldname);
    } else if (file.fieldname === "image") {
      profileImageFilter(req, file, cb, file.fieldname);
    } else if (file.fieldname === "images[]") {
      profileImageFilter(req, file, cb, file.fieldname);
    } else if (file.fieldname === "brochure") {
      brochureFilter(req, file, cb, file.fieldname);
    } else {
      cb(new Error("Invalid file field"));
    }
  },
});

module.exports = {
  upload,
};
