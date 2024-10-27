const express = require('express')
const multer = require('multer')
const router = express.Router()

const authenticateToken = require('../middleware/auth')

const {
  CreateNewForm,
  GetReachedPeople,
  GetIndividual,
  UpdateIndividual,
} = require('../controller/form.controller')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

router.post('/createNewForm', upload.single('file'), CreateNewForm)
router.get('/getReachedPeoples', GetReachedPeople)
router.get('/getIndividual/:id', GetIndividual)
router.put('/updateIndividual/:id', UpdateIndividual)

module.exports = router