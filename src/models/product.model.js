import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
