const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../model/user.model')

exports.SignUp = async (req, res) => {
  try {
    const {username, email, password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).send("User already exists")
    }
    if(!password){
      return res.status(400).send("Password is required")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    throw error 
  }
}
exports.LogIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send("Incorrect email or password.")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const userInfo = {
        id: user._id,
        role: user.role
      }
      const accessToken = jwt.sign(userInfo, process.env.TOKEN_SECRET)
      return res.json({ 
        message: `Welcome, ${user.username}!`, 
        accessToken, 
        role: user.role,
        userId: user._id 
      });
    } else {
      return res.status(401).send("Incorrect email or password. Please try again.")
    }
  } catch (error) {
    console.error("Error logging user: ", error);
    res.status(500).send("An error occurred while logging.");
  }
}

exports.ChangePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({email})
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Current password is incorrect.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send("Password changed successfully.");
  } catch (error) {
    throw error
  } 
}