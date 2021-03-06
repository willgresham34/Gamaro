const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Inventory = require("./Inventory");
const Order = require("./Order");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: [true, "Username already taken!"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email address already registered!"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password too short!"],
  },
  rating: {
    type: Number,
    validate: (v) => 5 >= v >= 1,
  },
  inventory: [Inventory.schema],
  orders: [Order.schema],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
