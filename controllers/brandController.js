const Brands = require("../models/brandSchema");

exports.getBrands = async (req, res) => {
  try {
    const data = await Brands.find();
    if (!data) {
      return res.status(401).json({ success: false, message: "No Brand Found!" });
    }
    res.status(201).json({ success: true, data })
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.brand_count = async (req, res) => {
  const count = await Brands.countDocuments({});
  res.status(200).json({ success: true, count })
}



exports.get_brand_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Brands.findById(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "No brand matches that id" });
    }

    res.status(201).json({ success: true, result })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.add_brand = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newBrand = await new Brands({
      name,
      description,
    })

    const result = await newOrder.save();
    res.status(201).json({ success: true, message: "Brand created successfuly", result });
  } catch (error) {
    console.log(error)
  }
}

exports.edit_brand = async (req, res) => {
  const { id, name, description } = req.body;
  try {
    const existingOrder = await Brands.findById(id);

    if (!existingOrder) {
      return res.status(401).json({ success: false, message: "Cannot find Brand" });
    }

    if (name) {
      existingBrand.name = name;
    }

    if (description) {
      existingBrand.description = description;
    }

    const results = await existingBrand.save();
    res.status(201).json({ success: true, results })
  } catch (err) {
    if (err) console.log(err)
  }
}


exports.delete_brand = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Brands.findByIdAndDelete(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "couldn't find and Delete the resource you are looking for" });
    }
    res.status(201).json({ success: true, message: "Order Deleted!" });
  } catch (err) {
    if (err) console.log(err)
  }
}


