const User     = require("../models/User");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const crypto   = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ─── Email transporter ────────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 resolution to prevent ENETUNREACH IPv6 errors on Render
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    if (user) {
      res.status(201).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Please provide an email");
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      res.status(500);
      throw new Error("Email service is not configured on the server. Please add EMAIL_USER and EMAIL_PASS to Render environment variables.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with 200 to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, you will receive reset instructions.",
      });
    }

    // Generate raw token & hash it for DB storage
    const rawToken   = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken  = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    const mailOptions = {
      from: `"VynexTee" <${process.env.EMAIL_USER}>`,
      to:   user.email,
      subject: "VynexTee — Reset Your Password",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; background: #0d1117; color: #e6edf3; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #0d1117); padding: 40px 36px 28px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
              VYNEX<span style="color: #60a5fa;">TEE</span>
            </h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.45); font-size: 13px;">Premium T-Shirts &amp; Bags</p>
          </div>
          <div style="padding: 36px;">
            <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700;">Reset your password</h2>
            <p style="margin: 0 0 24px; color: rgba(255,255,255,0.55); line-height: 1.6; font-size: 14px;">
              Hi ${user.name},<br/><br/>
              We received a request to reset the password for your VynexTee account.
              Click the button below to choose a new password. This link expires in <strong style="color:#60a5fa;">10 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                 style="display: inline-block; background: #3b82f6; color: #fff; text-decoration: none;
                        padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 15px;
                        box-shadow: 0 4px 20px rgba(59,130,246,0.35);">
                Reset Password
              </a>
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.30); text-align: center; line-height: 1.6;">
              If you didn't request this, you can safely ignore this email.<br/>
              Your password won't change until you click the button above.
            </p>
            <div style="border-top: 1px solid rgba(255,255,255,0.07); margin-top: 28px; padding-top: 20px;">
              <p style="font-size: 11px; color: rgba(255,255,255,0.20); word-break: break-all;">
                Or paste this link in your browser:<br/>
                <a href="${resetUrl}" style="color: #60a5fa;">${resetUrl}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const transporter = createTransporter();
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Nodemailer sendMail failed:", emailErr);
      user.resetPasswordToken  = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500);
      throw new Error("Failed to send email: " + (emailErr.message || "Email server error"));
    }

    res.status(200).json({
      message: "If that email is registered, you will receive reset instructions.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const rawToken     = req.params.token;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    // Hash the incoming token to match what's stored
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired reset token");
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password            = await bcrypt.hash(password, salt);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};

