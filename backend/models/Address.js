import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
