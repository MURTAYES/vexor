const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createProduct, updateProduct, restockSku, uploadImage } = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.use(requireAuth); // All mutation routes require auth

router.post('/image', upload.single('image'), uploadImage);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/skus/:id/restock', restockSku);

module.exports = router;
