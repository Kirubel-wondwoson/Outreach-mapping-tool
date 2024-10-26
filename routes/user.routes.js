const express = require('express')
const router = express.Router()

const authenticateToken = require('../middleware/auth')

const {
  SignUp,
  LogIn,
  ChangePassword
} = require('../controller/user.controller')


router.post('/signup', SignUp)
router.post('/login', LogIn)
router.patch('/changePassword', authenticateToken, ChangePassword)

module.exports = router