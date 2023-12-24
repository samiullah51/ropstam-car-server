const mongoose = require("mongoose");
const CarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // This references the user model
    },
    category: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    madeIn: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("car", CarSchema);
