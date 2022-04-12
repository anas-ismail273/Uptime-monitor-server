import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendCode from "../services/mailer-service.js";
import {
  signupValidationSchema,
  loginValidationSchema,
  verifyValidationSchema,
} from "../shcemas/auth-schemas.js";

const { sign } = jwt;
const { genSalt, hash, compare } = bcrypt;
// const mailerService = new MailerService();

// Sign up
const signUp = async (req, res) => {
  try {
    // Validate the data
    const { error } = signupValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) return res.status(400).send("User already exists");

    // encrypt password
    const salt = await genSalt(10);
    const encryptedPassword = await hash(req.body.password, salt);

    // this will be sent using email
    const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // Create a new user
    const user = new User({
      email: req.body.email,
      password: encryptedPassword,
      verificationCode: code,
    });

    await user.save();
    sendCode(user);
    res.send(
      `User: ${user._id} signed up, please verify then login, code ${code}`
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Login
const login = async (req, res) => {
  try {
    // Validate the data
    const { error } = loginValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    // Check if user not verified yet
    if (user.isVerified == false)
      return res
        .status(400)
        .send("User is not verified, please verify and login");

    // Check if password correct
    const validPassword = await compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send("Invalid password");

    // Create a token
    const token = sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_SECRET
    );

    // remove_this
    await User.findByIdAndUpdate({ _id: user._id }, { token: token });
    res.header("auth-token", token).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const verify = async (req, res) => {
  try {
    // Validate the data
    const { error } = verifyValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    // Check if user verified
    if (user.isVerified == true) {
      return res.status(400).send("User is already verified, please login");
    }

    // Check if verification code is not valid
    if (user.verificationCode != req.body.verificationCode) {
      return res.status(400).send("Invalid code");
    }

    // Verify user
    await User.findOneAndUpdate({ _id: user._id }, { isVerified: true });
    res.status(200).send("User is verified, login");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { signUp, login, verify };
