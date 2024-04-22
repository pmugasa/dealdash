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

    const verificationToken = jwt.sign(
      { data: "Token data" },
      config.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const verificationLink = `http://localhost:3001/api/authentication/verify/${savedUser.id}/${verificationToken}`;

    res.status(201).json({ savedUser, verificationLink });
  } catch (error) {
    next(error);
  }
});

//account verification
authenticationRouter.get("/verify/:id/:token", async (req, res, next) => {
  try {
    const { token, id } = req.params;

    const user = await User.findById(id);

    if (!user) return res.status(404).send("User not found");

    jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
      if (err) {
        logger.error(err);
        return res
          .status(400)
          .send("Email verification failed. Link is invalid or expired.");
      } else {
        //update user to verified
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { isVerified: true },
          { new: true, runValidators: true, context: "query" }
        );
        res.json({ updatedUser, message: "Email was successfully verified." });
      }
    });
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
