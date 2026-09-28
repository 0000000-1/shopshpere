import Stripe from "stripe";
import User from "../models/User.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    console.log(" CONTROLLER IS RUNNING!");
    const { cartItems } = req.body;

    // Safety check: Log the incoming items to your backend console
    console.log("Cart items received by backend:", cartItems);
    // req.user is safely injected into the request object by your authMiddleware
    const customerEmail = req.user.email; // check this later?
    console.log(req.user); //error here

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.productId.title },
        unit_amount: Math.round(item.productId.price * 100), //calculate in paisa
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      billing_address_collection: "required", // Mandatory RBI compliance requirement
      customer_email: customerEmail,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error.message);
    return res
      .status(500)
      .json({ error: "Payment processing failed. Please try again." });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  // verify session + create order + clear cart
  const { session_id } = req.query;
  if (!session_id)
    return res
      .status(400)
      .json({ success: false, message: "Session Id is required" });
  let verifySession;
  try {
    verifySession = await stripe.checkout.sessions.retrieve(session_id);
  } catch (error) {
    console.error("Stripe retrieve error:", error.message);
    return res
      .status(500)
      .json({ error: "Could not verify payment with Stripe." });
  }

if (verifySession.payment_status !== "paid") {
  return res.status(400).json({ error: "Payment not completed." });
}
  // prevent double order
  const existingOrder = await Order.findOne({ stripeSessionId: session_id });
  if (existingOrder) {
    return res
      .status(200)
      .json({ order: existingOrder, alreadyProcessed: true });
  }

  try {
    const user_id = req.user.id;
    // const user_id = verifySession.line_Items.userId;
    const user = await User.findById(user_id).populate("cartItems.productId")

    // order update
    const orderProducts = user.cartItems.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = verifySession.amount_total / 100;
    const order = await Order.create({
      user: user_id,
      products: orderProducts,
      totalAmount:totalAmount,
      stripeSessionId: session_id,
      paymentStatus: "paid",
    });
    // clear cart
    user.cartItems = [];
    await user.save();

    return res.status(200).json({ order });
  } catch (error) {
    // 3. Catch the Strict Mode duplicate key error safely
    if (error.code === 11000) {
      console.log("Strict Mode double-fire intercepted. Fetching completed order.");
      
      // Force an atomic cart clear just in case the winning request failed mid-flight
      await User.updateOne({ _id: req.user.id }, { $set: { cartItems: [] } });
      
      const raceWinnerOrder = await Order.findOne({ stripeSessionId: session_id });
      return res.status(200).json({ order: raceWinnerOrder, alreadyProcessed: true });
    }

    console.error("Order creation error:", error.message);
    return res.status(500).json({ error: "Could not create order." });
  }
};

// Get session_id from the right place on the request
// Guard: missing session_id → error response, return
// Ask Stripe: is this session actually paid? (wrap in try/catch, and actually return after sending the error response)
// Guard: already have an order for this session? → return it, don't make a duplicate
// Figure out which user this is — using req.user, not Stripe metadata, not req.body
// Fetch that user's real cart from the database (same pattern as getCart)
// Turn the cart into an array of order-line-items
// Create the Order (placeholder field names is fine for now)
// Clear the user's cart and save
// Send back a success response
