const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticationRouter = require("express").Router();
const User = require("../models/user");

//create customer account
authenticationRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    } else if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ email, passwordHash });

    if (email === "admin@dealdash.co.zw") {
      user.isAdmin = true;
    }

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

//login customer
authenticationRouter.post("/login", async (req, res) => {});

module.exports = authenticationRouter;
