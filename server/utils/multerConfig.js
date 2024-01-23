// multerConfig.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.memoryStorage(); // This stores the file in memory as a Buffer

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/; // TODO: Can I add .webp?
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profileImage'); // 'profileImage' should match the name attribute in your form

module.exports = upload;
