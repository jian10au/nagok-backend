const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

const genAuthToken = require("../utils/genAuthToken");
const isAuthenticated = require("../utils/isAuthenticated");

router.post("/signin", async (req, res) => {
  try {
    const signInUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    console.log(signInUser);

    if (signInUser) {
      res.send({
        _id: signInUser.id,
        name: signInUser.name,
        email: signInUser.email,
        isAdmin: signInUser.id,

        token: genAuthToken(signInUser),
      });
    } else {
      res.status(401).send({ msg: "Invalid Email or Password" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    if (req.body.name && req.body.password && req.body.email) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
      });
      console.log("user created profile");
      console.log(user, "what is the new user");
      const registerUser = await user.save();
      res.status(200).send({
        _id: registerUser._id,
        name: registerUser.name,
        email: registerUser.email,
        isAdmin: registerUser.isAdmin,
        token: genAuthToken(registerUser),
      });
    } else {
      res.status(500).send({ msg: "Please enter name, email and password" });
    }
  } catch (error) {
    res.status(500).send({ msg: error.messag });
  }
});

router.get("/createadmin", async (req, res) => {
  try {
    const user = new User({
      name: "Jian",
      email: "jian10au@gmail.com",
      password: "1234",
      isAdmin: true,
    });
    const newAdminUser = await user.save();
    res.status(200).send(newAdminUser);
  } catch (err) {
    res.send({ msg: err.message });
  }
});

router.get("/test", (req, res) => {
  res.send("working ok");
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  console.log(user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    console.log(updatedUser, "here");
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: genAuthToken(updatedUser),
    });
  } else {
    res.status(404).send({ msg: "User Not Found" });
  }
});

module.exports = router;
