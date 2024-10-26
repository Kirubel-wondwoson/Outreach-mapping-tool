const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true 
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "Admin"
  }
}, {timestamps: true})

const User = mongoose.model("User", UserSchema)

module.exports = User