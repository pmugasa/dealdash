const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticationRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

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
authenticationRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    } else if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findOne({ email });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userForToken = {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
    };

    const token = jwt.sign(userForToken, config.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    res.status(200).send({ token, userForToken });
  } catch (error) {
    next(error);
  }
});

module.exports = authenticationRouter;
