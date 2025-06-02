import User from '../models/UserModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRES = '1d';

// Generate JWT token
const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// User registration controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      return res.status(400).json({
        success: false,
        message: 'Password must be strong (min 8 chars, with upper, lower, number, symbol)',
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user object
    const newUser = new User({
      username: validator.escape(username.trim()),
      email: validator.normalizeEmail(email),
      password: hashedPassword,
    });

    // Save user
    await newUser.save();

    // Generate JWT token
    const token = createToken(newUser._id);

    // Send response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
// User login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = createToken(user._id);

    // Send response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Get Current User Controller
export const getCurrentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('name email');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
// Update User Controller
export const updateUser = async (req, res) => {
 
        const { username, email } = req.body;

        // Basic input validation
        if (!username || !email ) {
            return res.status(400).json({ success: false, message: 'Username and email are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        try{

        // Find user and update
        const exists = await User.findOne({email,id: { $ne: req.user.id }});
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                username: validator.escape(username.trim()),
                email: validator.normalizeEmail(email),
            },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user});

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
// change password controller
export const UpdatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Basic input validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    if (!validator.isStrongPassword(newPassword, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
        return res.status(400).json({
            success: false,
            message: 'New password must be strong (min 8 chars, with upper, lower, number, symbol)',
        });
    }

    try {
        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
