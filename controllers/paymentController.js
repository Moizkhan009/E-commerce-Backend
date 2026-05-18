const User = require("../models/User");

// @desc    Get all payment methods
// @route   GET /api/payments
// @access  Private
const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      count: user.paymentMethods.length,
      data: user.paymentMethods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add payment method
// @route   POST /api/payments
// @access  Private
const addPaymentMethod = async (req, res) => {
  try {
    const {
      cardNumber,
      cardHolderName,
      expiryDate,
      isDefault,
      paymentType,
      upiId
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Validation
    if (!cardNumber || !cardHolderName || !expiryDate || !paymentType) {
      return res.status(400).json({ message: "Please add all required fields" });
    }
    
    if (isDefault) {
      user.paymentMethods.forEach(pm => {
        pm.isDefault = false;
      });
    }
    
    // Store only last 4 digits for security
    const lastFourDigits = cardNumber.slice(-4);
    
    user.paymentMethods.push({
      cardNumber: lastFourDigits,
      cardHolderName,
      expiryDate,
      isDefault: isDefault || false,
      paymentType,
      upiId: upiId || ""
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      data: user.paymentMethods[user.paymentMethods.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payments/:paymentId
// @access  Private
const deletePaymentMethod = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    const paymentExists = user.paymentMethods.find(pm => pm._id.toString() === paymentId);
    if (!paymentExists) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    
    user.paymentMethods = user.paymentMethods.filter(
      pm => pm._id.toString() !== paymentId
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default payment method
// @route   PUT /api/payments/:paymentId/default
// @access  Private
const setDefaultPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const user = await User.findById(req.user._id);
    
    let found = false;
    user.paymentMethods.forEach(pm => {
      if (pm._id.toString() === paymentId) {
        pm.isDefault = true;
        found = true;
      } else {
        pm.isDefault = false;
      }
    });
    
    if (!found) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Default payment method set successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPayment
};