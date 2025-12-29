import Address from "../models/Address.js";

// =================== Get addresses ===================
export const getAddresses = async (req, res) => {
    try {
        const { email } = req.params;
        const addresses = await Address.find({ userEmail: email });
        res.json(addresses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
};

// =================== Add address ===================
export const addAddress = async (req, res) => {
    try {
        const address = new Address(req.body);
        const saved = await address.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Failed to add address" });
    }
};

// =================== Update address ===================
export const updateAddress = async (req, res) => {
    try {
        const updated = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update address" });
    }
};

// =================== Delete address ===================
export const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.json({ message: "Address deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete address" });
    }
};
