const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    min: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVendor: {
    type: Boolean,
    default: true,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
});

vendorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
