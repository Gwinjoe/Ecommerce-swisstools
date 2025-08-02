const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");

exports.getProducts = async (req, res) => {
  const results = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(results);
}

exports.add_product = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    keyFeatures,
    whatsInBox,
    productDetails,
    mainImage,       // Cloudinary URL
    thumbnails       // Array of Cloudinary URLs
  } = req.body;

  try {
    // Check if product already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists!"
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [keyFeatures],
      whatsInBox: Array.isArray(whatsInBox) ? whatsInBox : [whatsInBox],
      productDetails,
      images: {
        mainImage,
        thumbnails,
      }
    });

    // Save to database
    const result = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: result
    });

  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.get_categories = async (req, res) => {
  try {
    const data = await Category.find();
    if (!data) {
      return res.status(401).json({ success: false, message: "No Category Found!" });
    }
    console.log(data)
    res.status(200).json({ success: true, data })
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
