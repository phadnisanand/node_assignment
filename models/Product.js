const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true, required: true, index: true },
  productName: { type: String, required: true },
  productExpiryDate: { type: Date, required: true },
  productImage: { type: String },
  totalProductQuantity: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  is_deleted_flag: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

productSchema.pre('save', function(next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);