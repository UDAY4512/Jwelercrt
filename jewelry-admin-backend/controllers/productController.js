const Product = require('../models/Product');

// Helper to generate unique product ID
const generateProductCode = async (gender, category) => {
  const prefix = `${gender[0]}${category.slice(0, 2).toUpperCase()}`; // e.g., mRI for man + ring
  const count = await Product.countDocuments({ gender, category });
  const serial = (count + 1).toString().padStart(3, '0'); // Pads like 001, 002
  return `${prefix}${serial}`; // Final format: mRI001
};

exports.uploadProduct = async (req, res) => {
  try {
    const { title, description, gender, category, carat, price } = req.body;

    // Extract uploaded image paths
    const imageUrls = req.files.map(file => file.path);

    // Generate a unique productId
    const productId = await generateProductCode(gender, category);

    const newProduct = new Product({
      title,
      description,
      gender,
      category,
      carat,
      price,
      image: imageUrls,
      productId, // Important: must match schema
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product uploaded',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Upload failed',
      error: error.message,
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      gender,
      category,
      carat,
      priceMin,
      priceMax,
      dateFrom,
      dateTo,
      productCode,
    } = req.query;

    const filter = {};

    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (carat) filter.carat = carat;
    if (productCode) filter.productId = productCode;

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const productsPromise = Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const countPromise = Product.countDocuments(filter);

    const [products, totalCount] = await Promise.all([productsPromise, countPromise]);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      products,
      totalCount,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      title,
      description,
      gender,
      category,
      carat,
      price,
      showOnWebsite
    } = req.body;

    // Update fields
    if (title) existingProduct.title = title;
    if (description) existingProduct.description = description;
    if (gender) existingProduct.gender = gender;
    if (category) existingProduct.category = category;
    if (carat) existingProduct.carat = carat;
    if (price) existingProduct.price = price;
    if (typeof showOnWebsite === 'boolean') existingProduct.showOnWebsite = showOnWebsite;

    // Optional: regenerate productId if gender or category is updated
    if (gender || category) {
      const newId = await generateProductId(gender || existingProduct.gender, category || existingProduct.category);
      existingProduct.productId = newId;
    }

    // Optional: Update images
    if (req.files && req.files.length > 0) {
      existingProduct.image = req.files.map(file => file.path);
    }

    await existingProduct.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product: existingProduct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

exports.toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.showOnWebsite = !product.showOnWebsite;
    await product.save();

    res.json({ 
      message: `Product visibility toggled to ${product.showOnWebsite}`, 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle visibility', error: error.message });
  }
};