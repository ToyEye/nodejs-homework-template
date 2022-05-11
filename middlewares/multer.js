const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, process.cwd(), "temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (res, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
