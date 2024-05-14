const { User } = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Register User
module.exports.register = (request, response) => {
  request.body.email = request.body.email.toLowerCase();
  const user = new User(request.body);
  user.confirmPassword = request.body.confirmPassword;

  user.save()
    .then((user) => {
      const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      response
        .cookie("usertoken", userToken, process.env.SECRET_KEY, {
          httpOnly: true,
        })
        .json({ msg: "Registered successfully!" });
    })
    .catch((err) => response.json(err));
};

// Login User
module.exports.login = async (request, response) => {
  const user = await User.findOne({ email: request.body.email.toLowerCase() });
  if (user === null) return response.status(400).json({ message: "Invalid email or password" });

  const correctPassword = await bcrypt.compare(request.body.password, user.password);
  if (!correctPassword) return response.status(400).json({ message: "Invalid email or password" });

  const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  response
    .cookie("usertoken", userToken, process.env.SECRET_KEY, { httpOnly: true })
    .json({ msg: "Logged in successfully!" });
};

// Logout User
module.exports.logout = (request, response) => {
  response.clearCookie("usertoken");
  response.sendStatus(200);
};

// Get Logged In User
module.exports.getLoggedInUser = (req, res) => {
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  User.findById(decodedJwt.payload.id)
    .then((user) => {
      res.json({
        user: {
          id: user.id,
          _id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
      });
    })
    .catch((error) => res.status(500).json(error));
};

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
  user.resetCode = code;
  user.resetCodeExpiration = Date.now() + 3600000; // Code expires in 1 hour

  await user.save();

  // Send the email with the reset code
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset Code",
    text: `Your password reset code is ${code}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err)
      return res.status(500).json({ message: "Email not sent", error: err });
    res.json({ message: "Reset code sent to email", success: true });
  });
};

// Verify Code
module.exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
    resetCode: code,
  });
  if (!user || user.resetCodeExpiration < Date.now())
    return res.status(400).json({ message: "Invalid or expired code" });

  res.json({ message: "Code verified", success: true });
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
  const { email, code, password, confirmPassword } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
    resetCode: code,
  });
  if (!user || user.resetCodeExpiration < Date.now())
    return res.status(400).json({ message: "Invalid or expired code" });

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  user.password = password;
  user.confirmPassword = confirmPassword; // Ensure this matches for the validation
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
