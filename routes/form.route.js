const express = require('express')
const multer = require('multer')
const router = express.Router()

const {
  CreateNewForm,
  GetReachedPeople,
  GetIndividual,
  UpdateIndividual,
  DeleteForm,
  handleUpload
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
// router.post('/upload', upload.single('file'), handleUpload)
router.get('/getReachedPeoples', GetReachedPeople)
router.get('/getIndividual/:id', GetIndividual)
router.put('/updateIndividual/:id', UpdateIndividual)
router.delete('/deleteForm/:id', DeleteForm)

module.exports = router