const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createProduct, updateProduct, restockSku, uploadImage, deleteProduct } = require('../controllers/productController');
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
    const { jerseyName, category, year } = req.query;
    const namePart = (jerseyName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const catPart = (category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const yearPart = (year || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseName = `${namePart}${catPart}${yearPart}` || 'jersey';
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
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
router.delete('/:id', deleteProduct);
router.patch('/skus/:id/restock', restockSku);

module.exports = router;
