const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const userModel = mongoose.model("iotuser", userSchema);
module.exports = userModel;
