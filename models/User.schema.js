const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: [true, "username is unique"],
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
      unique: [true, "email is unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      minlength: 8,
    },
    company: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    position: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    accountType: {
      type: String,
      enum: ["client", "admin", "headOffice"],
      required: [true, "Account type is required"],
      default: "client",
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("quotes", {
  ref: "Quote",
  foreignField: "quoteOwner",
  localField: "_id",
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
