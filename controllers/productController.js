const Products = require("../models/productSchema");
const Category = require("../models/categorySchema");

exports.getProducts = async (req, res) => {
  const results = await Products.find().sort({ createdAt: -1 });
  res.status(200).json(results);
}

exports.add_product = async (req, res) => {

}

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
