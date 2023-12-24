const User = require("../models/user.model");
const generatePassword = require("../utils/generatePassword");
const sendEmail = require("../utils/sendEmail");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

// @description       User registration
// @route             POST http://localhost:8000/ropstam-car/api/v1/register
// @access            Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    // check if user already exists or not
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        data: { message: null, error: "email already exists" },
      });
    }
    // Generate random password
    const randomPassword = generatePassword(firstName);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: CryptoJS.AES.encrypt(
        randomPassword,
        process.env.CRYPTO_SEC
      ).toString(),
    });

    // save user into the database
    await newUser.save();

    // send email
    sendEmail(firstName, lastName, email, randomPassword);

    res.status(200).json({
      success: true,

      data: {
        message: `Dear ${firstName} ${lastName}, your account is created successfully. A password has been sent to ${email}. Now you can login with that password. Thanks`,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       User Login
// @route             POST http://localhost:8000/ropstam-car/api/v1/login
// @access            Public
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // Check if user exist or not
    if (!user) {
      return res.status(401).json("user not found");
    } else {
      // Decrypt the password which is stored in Encryption form in database
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTO_SEC
      );
      const realPassword = await hashedPassword.toString(CryptoJS.enc.Utf8);
      if (realPassword !== req.body.password) {
        return res.status(401).json(" Password is Incorrect");
      } else {
        // Create Token
        const token = JWT.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );
        const { password, ...others } = user._doc;
        res
          .header("token", token)
          .json({ success: true, data: { ...others, token }, error: null });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

module.exports = {
  register,
  login,
};
