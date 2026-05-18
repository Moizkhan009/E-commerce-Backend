

const User = require("..//models/User");

const getAddresses = async (req, res) => {
  try {
    // req.user._id comes from decoded token
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.addresses?.length || 0,
      data: user.addresses || []
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:addressId
// @access  Private
const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    const address = user.addresses.find(addr => addr._id.toString() === addressId);
    
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
      addressType
    } = req.body;
    
    // Fetch user from database
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    // Required fields validation
    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ 
        success: false,
        message: "Please add all required fields" 
      });
    }
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this address is default, remove default from all other addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses.push({
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      pincode,
      country: country || "India",
      isDefault: isDefault || false,
      addressType: addressType || "home"
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses[user.addresses.length - 1]
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }
    
    // If setting as default, remove default from others
    if (updates.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update address fields
    const allowedUpdates = ['fullName', 'phoneNumber', 'addressLine1', 'addressLine2', 
                           'city', 'state', 'pincode', 'country', 'isDefault', 'addressType'];
    
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        user.addresses[addressIndex][key] = updates[key];
      }
    });
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    const addressExists = user.addresses.find(addr => addr._id.toString() === addressId);
    if (!addressExists) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }
    
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== addressId
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:addressId/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    let found = false;
    user.addresses.forEach(addr => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });
    
    if (!found) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Default address set successfully"
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};