// `userController.js` → Logic for user routes.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "enter correct credentials!" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const getPassword = await bcrypt.compare(password, user.password);
    if (!getPassword) {
      return res.status(401).json({ message: "enter correct password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // FIX: Return a clean 'user' object so 'const { token, user } = res' functions correctly
    return res.status(200).json({
      message: "login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("DETAILED BACKEND CRASH ERROR:", error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "already exist user" });
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPass,
    });

    const savedUser = await newUser.save();

    // FIX: Create a token automatically upon registration so users are instantly logged in
    const token = jwt.sign(
      { id: savedUser.id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // FIX: Return token and user structure to match your React context expectations
    return res.status(201).json({
      message: "created new user",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const getCart = async (req, res) => {
  //fixed
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cartItems.productId");
    // const productsIs = user.cartItems.map(item=>item.productId)
    // const products = await Product.find({_id:{$in : productsIds}}) // can us this for manual work which replaced by populate()

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ cartItems: user.cartItems }); // renamed from 'user'
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  //fixed
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
      return res
        .status(400)
        .json({ message: "quantity must be a valid number" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const existingItem = user.cartItems.find(
      (p_id) => p_id.productId.toString() === productId,
    );
    
    if (existingItem) {
      existingItem.quantity = Math.max(1, existingItem.quantity + quantity);
    } else {
         user.cartItems.push({ productId, quantity: Math.max(1, quantity) });
    //  await User.updateOne(
    //   { _id: userId, "cartItems.productId": productId }, // use this instead of .save() it save from race condition, and it bettter.
    //   { $inc: { "cartItems.$.quantity": quantity } },
    // ); // can done this for race condiiton hehehe
    }
    await user.save()
    await user.populate("cartItems.productId");
    res.status(200).json({ user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  // fixed
  try {
    const userId = req.user.id;
    const getProductId = req.params.id; // Look at your route definition file its id not productId in routes check routes
    // 1. Pull the item and populate the remaining items in ONE single query
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: { productId: getProductId } } },
      { returnDocument: "after" }, // Returns the document AFTER the item is removed
    ).populate("cartItems.productId");
    // 2. Handle case where user is not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "item removed", cartItems: updatedUser.cartItems });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

// need to fix
// export const updateUser = async (req, res) => {
//   const getAdminId = req.params.id;
//   const { name, password, email, role } = req.body;
//   const userId = req.body.id;
//   // write something that update user to admin by certain admin's

//   // check if admin is true then it can change user to admin
//   const getAdmin = await findById(getAdminId);
//   if (!getAdmin) res.status(404).json({ message: "Admin user not found" });
//   if (getAdmin.role === "admin") {
//     const user = User.findByIdAndUpdate(id, { role: role });
//   } else {
//     console.error(error, " error in updating user by admin");
//   }
// };

//   1. Find out who's logged in
// const userId = req.user.id; — you already have this correct.
// 2. Get which product to remove, from the request
// const { productId } = req.body; — the frontend needs to send WHICH product to remove in the request body. You have this too, just double check the variable name matches what your route/frontend actually sends.
// 3. Fetch the user's full document
// const user = await User.findById(userId); — you don't need .populate() here, since you're not sending product details back (see our last message — Option A). Populate is only needed when you want to DISPLAY product info, not when you're just searching/removing by id.
// 4. Remove the matching item, keep everything else
// This is where your line has a bug: user.cartItems.find(item => item === item._id) compares the whole item object to its own _id — that will never be true.
// You want to KEEP every item whose id does NOT match the one being removed.
//  What array method removes non-matching items while keeping the rest? (You've used it before, in your frontend's removeFromCart.)
// 5. Save the updated cartItems array back onto the user, then save
// user.cartItems = /* the new filtered array */; then await user.save();
// 6. Respond
// res.status(200).json({ message: 'item removed', cartItems: user.cartItems }); — confirm success, and optionally send back the new (shorter) cart list so frontend can sync.
// const updatedUser = await User.findById(userId); // makes thing slow
//chamge here from item._id to item.producTId
// user.cartItems.pull({ productId: getProductId });// slow
// const filteredProduct = user.cartItems.filter(item => item.productId.toString() !== getProductId);
// user.cartItems= filteredProduct; // stop doing this, this guy overwriting user.cartItems with a plain filtered JavaScript array, Mongoose lost track of the other items' states. When it ran .save(), it accidentally wiped out or corrupted the structure of the remaining items, making them show up as empty or unknown.
// use Mongoose's built-in array subdocument methods. Mongoose arrays have their own .remove() or .pull() methods buildin.
// await user.save();
// await user.populate("cartItems.productId");
