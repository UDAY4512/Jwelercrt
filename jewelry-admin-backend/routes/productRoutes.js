const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { uploadProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const {
  getProducts,
  updateProduct,
  deleteProduct,
  toggleVisibility,
} = require('../controllers/productController');

router.get('/', getProducts);
router.put('/:id', upload.array('images', 10), updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/toggle-visibility', toggleVisibility);

router.post('/upload',  upload.array('images'), uploadProduct);

module.exports = router;
