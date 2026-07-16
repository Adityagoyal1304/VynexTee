const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Fetch all products (optional category filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404);
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, description, color, badge, images, sizes } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description,
      color,
      badge: badge || null,
      images: images || [],
      sizes: sizes || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404);
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.description = req.body.description !== undefined ? req.body.description : product.description;
      product.color = req.body.color !== undefined ? req.body.color : product.color;
      product.badge = req.body.badge !== undefined ? req.body.badge : product.badge;
      product.images = req.body.images || product.images;
      product.sizes = req.body.sizes || product.sizes;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404);
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
