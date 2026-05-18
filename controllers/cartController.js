const Cart    = require("../models/Cart");
const Product = require("../models/Product");

// ── GET /api/cart ──────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const user = req.user.id;
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(200).json({ user, cartItems: [], totalPrice: 0 });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/cart ─────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const user = req.user.id;
    let { productId, qty } = req.body;

    qty = Number(qty);
    if (isNaN(qty) || qty < 1) qty = 1;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user });
    if (!cart) cart = new Cart({ user, cartItems: [] });

    const idx = cart.cartItems.findIndex(
      (i) => i.product.toString() === productId
    );

    if (idx > -1) {
      cart.cartItems[idx].qty = Number(cart.cartItems[idx].qty) + qty;
    } else {
      cart.cartItems.push({
        product: product._id,
        name:    product.name,
        image:   product.image,
        price:   product.price,
        qty,
      });
    }

    const updated = await cart.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/cart ──────────────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const user = req.user.id; // ✅ token se — body se nahi
    let { productId, qty } = req.body;

    qty = Number(qty);

    if (!productId || isNaN(qty)) {
      return res.status(400).json({ message: "productId and qty required" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.cartItems.findIndex(
      (i) => i.product.toString() === productId
    );

    if (idx === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (qty <= 0) {
      cart.cartItems.splice(idx, 1); // qty 0 = remove
    } else {
      cart.cartItems[idx].qty = qty;
    }

    const updated = await cart.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/cart ───────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const user = req.user.id; // ✅ token se — body se nahi
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const before = cart.cartItems.length;
    cart.cartItems = cart.cartItems.filter(
      (i) => i.product.toString() !== productId
    );

    if (cart.cartItems.length === before) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const updated = await cart.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
// module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
module.exports ={ getCart, addToCart,updateCartItem,removeFromCart};
