const User = require("../models/user.model");
const generatePassword = require("../utils/generatePassword");
const sendEmail = require("../utils/sendEmail");
const CryptoJS = require("crypto-js");

// @description       User registration
// @route             POST http://localhost:8000/ropstam-car/api/v1/register
// @access            Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    // check if user already exists or not
    const checkUser = await User.find({ email });
    if (checkUser.length > 0) {
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

module.exports = {
  register,
};
