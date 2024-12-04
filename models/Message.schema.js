const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      minlength: 8,
    },
    message: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000,
      required: [true, "message is required"],
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
