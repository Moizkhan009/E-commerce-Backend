const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ✅ ADD TO CART
const addToCart = async (req, res) => {


  try {
    const user = req.user.id
    console.log(user);
    
    let {productId, qty } = req.body;

    // 🔥 sanitize qty
    qty = Number(qty);
    if (isNaN(qty) || qty < 1) qty = 1;

    if (!productId) {
      return res.status(400).json({ message: " productId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user , productId });

    if (!cart) {
      cart = new Cart({ user, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].qty =
        Number(cart.cartItems[itemIndex].qty) + qty;
    } else {
      cart.cartItems.push({
        
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: qty,
      });
    }

    const updatedCart = await cart.save(); // total auto calculate (model)
    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ UPDATE CART ITEM
const updateCartItem = async (req, res) => {
  try {
    let { user, productId, qty } = req.body;

    qty = Number(qty);

    if (!user || !productId) {
      return res.status(400).json({ message: "user and productId required" });
    }

    if (isNaN(qty)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    // remove if qty <= 0
    if (qty <= 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      cart.cartItems[itemIndex].qty = qty;
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const { user, productId } = req.body;

    if (!user || !productId) {
      return res.status(400).json({ message: "user and productId required" });
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.cartItems.length;

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.cartItems.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
};