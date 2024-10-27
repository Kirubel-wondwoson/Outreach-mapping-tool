const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require("dotenv").config()
const app = express()


const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.json({extended: false}))
app.use(cors())

const corsOptions = {
  origin: 'https://www.nileshblog.tech/',//(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB()

app.use('/user', require('./routes/user.routes'))
app.use('/form', require('./routes/form.route'))

app.listen(PORT, console.log(`Running on port ${PORT}`))