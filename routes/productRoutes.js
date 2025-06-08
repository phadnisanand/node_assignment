const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const productController = require('../controllers/productController');

router.post('/', auth, upload.single('productImage'), productController.addProduct);
router.patch('/:id', auth, upload.single('productImage'), productController.updateProduct);
router.post('/search', auth, productController.getAllProducts);
router.get('/:id', auth, productController.getProductById);
router.delete('/:id', auth, productController.deleteProduct);
router.post('/purchase', auth, productController.purchaseProduct);
router.put('/quantity', auth, productController.updateQuantity);
router.post('/share-photo', auth, productController.shareProductPhoto);

module.exports = router;