const Orders = require("../models/orderSchema");


exports.order_count = async (req, res) => {
  const count = await Orders.countDocuments({});
  res.status(200).json({ success: true, count })
}



exports.getOrders = async (req, res) => {
  try {
    const data = await Orders.find().sort({ createdAt: -1 }).populate("customer", "product");
    if (!data) {
      return res.status(401).json({ success: false, message: "No Order Found!" });
    }
    res.status(201).json({ success: true, data })
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.get_order_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Orders.findById(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "No order matches that id" });
    }

    res.status(201).json({ success: true, result })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.add_order = async (req, res) => {
  const { status, items, customer } = req.body;
  try {
    const products = items || [];
    const newOrder = await new Orders({
      status,
      products,
      customer
    })

    const result = await newOrder.save();
    res.status(201).json({ success: true, message: "Your order has been created successfuly", result });
  } catch (error) {
    console.log(error)
  }
}

exports.edit_order = async (req, res) => {
  const { id, status } = req.body;
  try {
    const existingOrder = await Orders.findById(id);

    if (!existingOrder) {
      return res.status(401).json({ success: false, message: "Cannot find Order" });
    }

    if (status) {
      existingOrder.status = status;
    }
    const results = await existingOrder.save();
    res.status(201).json({ success: true, results })
  } catch (err) {
    if (err) console.log(err)
  }
}


exports.delete_order = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Orders.findByIdAndDelete(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "couldn't find and Delete the resource you are looking for" });
    }
    res.status(201).json({ success: true, message: "Order Deleted!" });
  } catch (err) {
    if (err) console.log(err)
  }
}


exports.editMultipleOrders = async (req, res) => {
  const { selectedIds, status } = req.body;
  try {
    const orderIds = selectedIds || [];
    for (const id of orderIds) {
      const existingOrder = await Orders.findById(id);
      if (!existingOrder) {
        return res.status(401).json({ success: false, message: "Couldn't find resources to be updated" });
      }

      if (!status) {
        return res.status(401).json({ success: false, message: "Invalid OrderId" });
      }

      existingOrder.status = status;
      await existingOrder.save();
    }
    res.status(201).json({ success: true, message: "Selected orders updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.delete_multiple_orders = async (req, res) => {
  console.log(req.body);
  const { selectedIds } = req.body;
  try {
    const orderIds = selectedIds || [];
    for (const id of orderIds) {
      const order = await Orders.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'order not found' });
      }
      const result = await Orders.findByIdAndDelete(id);
      if (!result) {
        return res.status(401).json({ success: false, message: "Couldn't find resource to be deleted" });
      }
    }
    res.status(201).json({ success: true, message: "Selected Items Deleted!" });
  } catch (err) {
    if (err) {
      console.log(err)
      res.status(500).json({ success: false, message: "Internal Server Error" })
    }
  }

}
