const express = require("express")
const router = express.Router()
require("dotenv").config()
const session = require("express-session")
const User = require("../model/user")

// @route    PUT api/vote/toggle
// @desc     toggle vote
// @access   Private
router.put("/toggle", async (req, res) => {
  try {
    const current_id = req.session.userId
    if (!current_id) {
      return res.status(403).json({ msg: "Please send userid" })
    }
    let user = await User.findById(current_id)

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] })
    }
    user.voted = !user.voted
    await user.save()
    res.status(200).json({
      user,
      msg: "Vote changed Successfully",
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/vote/all
// @desc    get all votes
// @access  Private
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({ voted: true })
    return res.status(200).json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
