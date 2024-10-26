const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require("dotenv").config()
const app = express()

app.use(cors())

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.json({extended: false}))

connectDB()

app.use('/user', require('./routes/user.routes'))
app.use('/form', require('./routes/form.route'))

app.listen(PORT, console.log(`Running on port ${PORT}`))