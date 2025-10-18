import User from "../models/userModel.js";

// Get all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Add a new address
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, zip, country, isDefault } = req.body;
    const user = await User.findById(req.user.id);

    if (isDefault) {
      // unset previous default
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({ street, city, state, zip, country, isDefault });
    await user.save();

    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add address" });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zip, country, isDefault } = req.body;
    const user = await User.findById(req.user.id);

    const addrIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );
    if (addrIndex === -1)
      return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses[addrIndex] = {
      ...user.addresses[addrIndex]._doc,
      street,
      city,
      state,
      zip,
      country,
      isDefault,
    };

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== id
    );

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
