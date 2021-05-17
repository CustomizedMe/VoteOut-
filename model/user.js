const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  voted: {
    type: Boolean,
    default: false,
  },
})

module.exports = User = mongoose.model("user", UserSchema)
