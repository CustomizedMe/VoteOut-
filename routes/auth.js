const express = require("express")
const router = express.Router()
const { OAuth2Client } = require("google-auth-library")
require("dotenv").config()
const client = new OAuth2Client(process.env.CLIENT_ID)
const User = require("../model/user")
const session = require("express-session")

// @route    POST api/auth/googlelogin
// @desc     Login user using google auth
// @access   Private
router.post("/googlelogin", async (req, res) => {
  try {
    // console.log("backend", req)
    const { token } = req.body
    // console.log(req.body)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    })
    // console.log("ticket", ticket)
    const { name, email } = ticket.getPayload()
    let p = await User.findOne({ email })
    if (!p) {
      const user = new User({
        name,
        email,
      })
      p = await user.save()
    }
    req.session.userId = p._id
    // console.log(p)
    // res.status(201)
    return res.status(201).json(p)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route    GET api/auth/me
// @desc     get current user
// @access   Private
router.get("/me", async (req, res) => {
  try {
    const current_id = req.session.userId
    let user = await User.findById(current_id)
    res.json(user)
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" })
  }
})

// @route    GET api/auth/me
// @desc     get current user
// @access   Private
router.get("/me", async (req, res) => {
  try {
    const current_id = req.session.userId
    res.json(current_id)
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" })
  }
})
// @route    DELETE api/auth/logout
// @desc     get current user
// @access   Private
router.delete("/logout", async (req, res) => {
  try {
    await req.session.destroy()
    res.status(200).json({
      msg: "Logged out successfully",
    })
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" })
  }
})

// // @route    GET api/auth/me
// // @desc     get current user
// // @access   Private
// router.get("/me", async (req, res) => {
//   try {
//     const { _id } = req.body
//     if (!_id) {
//       return res.status(400).json({ msg: "Send id in the body" })
//     }
//     const user = await User.findById(_id)
//     if (user) {
//       return res.status(200).json({ user, msg: "User sent successfully" })
//     }
//     return res.status(404).json({ msg: "User not found with the id" })
//   } catch (err) {
//     return res.status(500).json({ msg: "Sometgin went wrong" })
//   }
// })
module.exports = router
