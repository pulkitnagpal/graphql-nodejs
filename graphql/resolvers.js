const User = require("../models/user");
const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
  createUser: async(args, req) => {
    const {userInput: {email, name, password}} = args;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({message: "Email is invalid"})
    }
    if (validator.isEmpty(password) || validator.isLength(password, {min: 5})) {
      errors.push({message: "password is too short"})
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      throw error;
    }
    const existingUser = await User.findOne({email})
    if (existingUser) {
      const error = new Error("User already exists");
      throw error;
    }
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email, password: hashedPass, name
    })
    const createdUser = await user.save();
    return {
      ...createdUser._doc, _id: createdUser._id.toString() 
    }
  }
}