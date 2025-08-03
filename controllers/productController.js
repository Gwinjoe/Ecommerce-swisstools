const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const uploader = require("../middlewares/uploader");

exports.getProducts = async (req, res) => {
  const results = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(results);
}

exports.get_categories = async (req, res) => {
  try {
    const data = await Category.find();
    if (!data) {
      return res.status(401).json({ success: false, message: "No Category Found!" });
    }
    res.status(201).json({ success: true, data })
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.get_category_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Category.findById(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "No Category matches that id" });
    }

    console.log(`categoryId-${id}: ${result}`);
    res.status(201).json({ success: true, result })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.add_category = async (req, res) => {
  const { name, description } = req.body;
  try {

    const existingCategory = await Category.findOne({ name })

    if (existingCategory) {
      console.log("category already exists")
      return res.status(401).json({ success: false, message: "Category already exists!" })
    }
    const newCategory = await new Category({
      name,
      description
    })

    const result = await newCategory.save();
    console.log(result)
    res.status(201).json({ success: true, message: "Your category has been created successfuly", result });
  } catch (error) {
    console.log(error)
  }
}

exports.edit_category = async (req, res) => {
  const { id, name, description } = req.body;
  try {
    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return res.status(401).json({ success: false, message: "Cannot find category" });
    }

    if (name) {
      existingCategory.name = name;
    }

    if (description) {
      existingCategory.description = description;
    }

    const results = await existingCategory.save();
    console.log(results);
    res.status(201).json({ success: true, results })
  } catch (err) {
    if (err) console.log(err)
  }
}


exports.delete_category = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "couldn't find and Delete the resource you are looking for" });
    }
    console.log(result)
    res.status(201).json({ success: true, message: "resource Deleted!" });
  } catch (err) {
    if (err) console.log(err)
  }
}



exports.add_product = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      productDetails,
      keyFeatures,
      whatsInBox
    } = req.body;

    // Parse array fields
    const featuresArray = JSON.parse(keyFeatures || '[]');
    const whatsInBoxArray = JSON.parse(whatsInBox || '[]');

    // Validate required fields
    if (!name || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get uploaded files
    const mainImageFile = req.files['mainImage'] ? req.files['mainImage'][0] : null;
    const thumbnailFiles = req.files['thumbnails'] || [];

    const mainImageCloudinary = await uploader(mainImageFile.path);

    const thumbnailsCloudinary = await thumbnailFiles.forEach(async (thumbnail) => {
      const thumbnailCloudinary = await uploader(thumbnail.path);
      return thumbnailCloudinary;
    })
    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      keyFeatures: featuresArray,
      whatsInBox: whatsInBoxArray,
      productDetails,
      images: {
        mainImage: mainImageFile ? {
          url: mainImageCloudinary.url,
          publicId: mainImageCloudinary.publicId,
        } : {}, // Cloudinary URL
        thumbnails: thumbnailsCloudinary.map(file => ({
          url: file.url,
          publicId: file.publicId,
        })) // Array of URLs
      }
    });

    // Save to database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: savedProduct
    });

  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

exports.delete_product = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find product to get image public IDs
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    const publicIds = [];

    // Add main image public ID if exists
    if (product.images.mainImage && product.images.mainImage.publicId) {
      publicIds.push(product.images.mainImage.publicId);
    }

    // Add thumbnail public IDs
    product.images.thumbnails.forEach(thumbnail => {
      if (thumbnail.publicId) {
        publicIds.push(thumbnail.publicId);
      }
    });

    // Delete all images at once
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    // Delete product from database
    await Product.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: 'Product and associated images deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion'
    });
  }
}
