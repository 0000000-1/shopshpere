//  `orderController.js` → Logic for order routes.
import Order from "../models/Order.js";

// (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
    return res.status(200).json({ allOrders: allOrders });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// (regular user)
export const getMyOrders =async(req,res) =>{
  try {
    const userId = req.user.id

    const orders = await Order.find({user:userId}).populate("products.product").sort({createdAt:-1})

    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({message:"server error", error:error.message})
  }
}

// (regular user, viewing one order's detail)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
