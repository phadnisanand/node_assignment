const Product = require('../models/Product');
const emailService = require('../services/emailService');
const logger = require('../config/logger');

// Auto increment simulation (replace with real counter in production)
let productCounter = 1;

exports.addProduct = async (req, res) => {
  try {
    const { productName, productExpiryDate, totalProductQuantity, status } = req.body;
    const productImage = req.file ? `/images/products/${req.file.filename}` : '';
    
    const lastProduct = await Product.findOne().sort({ productId: -1 });
    const productId = lastProduct ? lastProduct.productId + 1 : productCounter++;
    
    const product = new Product({
      productId,
      productName,
      productExpiryDate,
      productImage,
      totalProductQuantity,
      status: status || 'Active',
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.productExpiryDate;
    delete updates.productId;
    if (req.file) {
      updates.productImage = `/images/products/${req.file.filename}`;
    }
    updates.updatedDate = Date.now();
    const product = await Product.findOneAndUpdate(
      { productId: id, is_deleted_flag: false },
      { $set: updates },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { createdDateSort = 'desc', status, search } = req.body;
    const filter = { is_deleted_flag: false };
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { productName: regex },
      ];
    }
    const products = await Product.find(filter).sort({ createdDate: createdDateSort === 'asc' ? 1 : -1 });
    res.json(products);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id, is_deleted_flag: false });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.id, is_deleted_flag: false },
      { is_deleted_flag: true, updatedDate: Date.now() },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted (soft delete)' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.purchaseProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Minimum purchase quantity is 1' });
    const product = await Product.findOne({ productId, is_deleted_flag: false, status: 'Active' });
    if (!product) return res.status(404).json({ message: 'Active product not found' });
    if (product.totalProductQuantity < quantity)
      return res.status(400).json({ message: 'Insufficient quantity available' });
    product.totalProductQuantity -= quantity;
    product.updatedDate = Date.now();
    await product.save();
    res.json({ message: 'Purchase successful', product });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ productId, is_deleted_flag: false });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.totalProductQuantity = quantity;
    product.updatedDate = Date.now();
    await product.save();
    res.json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.shareProductPhoto = async (req, res) => {
  try {
    const { productId, email } = req.body;
    const product = await Product.findOne({ productId, is_deleted_flag: false });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.productImage) return res.status(400).json({ message: 'Product image not found' });
    const photoUrl = `${req.protocol}://${req.get('host')}${product.productImage}`;
    await emailService.sendProductPhotoEmail(email, product.productName, photoUrl);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};