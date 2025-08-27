import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe";
import User from "../models/User.js";

// ------------------ Place Order COD ------------------
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate total amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add 2% tax
    const taxAmount = Math.floor(amount * 0.02);
    amount += taxAmount;

    // Create COD order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ------------------ Place Order Stripe ------------------
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];

    // Calculate amount + prepare stripe line items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add 2% tax
    const taxAmount = Math.floor(amount * 0.02);
    amount += taxAmount;

    // Create order in DB (not paid yet)
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Stripe line items (price in cents, with tax)
    const line_items = productData.map((item) => {
      const unitAmountCents = Math.floor(item.price * 100 * 1.02); // tax included
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: unitAmountCents,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ------------------ Stripe Webhook ------------------
export const stripeWebhook = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { orderId, userId } = session.metadata;

      // Mark order as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      // Clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = sessions.data[0].metadata;
      // Delete failed order
      await Order.findByIdAndDelete(orderId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// ------------------ Get Orders By User ------------------
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIX: return ALL orders for user (COD + Online, paid or pending)
    const orders = await Order.find({ userId })
      .populate({
        path: "items.product",
        select: "name category image offerPrice",
      })
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ------------------ Get All Orders (Admin/Seller) ------------------
// Get all orders (Admin/Seller) : /api/orders/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
  .populate({
    path: "items.product",
    select: "name category image offerPrice",
  })
  .populate("address")
  .sort({ createdAt: -1 });


    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
