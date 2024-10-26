const jwt = require('jsonwebtoken')
const Form = require('../model/form.model')

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

exports.CreateNewForm = async (req, res) => {
  try {
    const { name, location, evangelismMethod, numOfPeopleReached, numOfPeopleSaved, numOfPeopleRepent, status, area, date, description} = req.body

    const dateEdit = new Date(date)
    if (isNaN(dateEdit.getTime())) {
      return res.status(400).send("Invalid Date")
    }

    if (numOfPeopleRepent > numOfPeopleReached || numOfPeopleSaved > numOfPeopleReached) {
      return res.status(400).send("The number of people saved or repented cannot be greater than the number of people reached.")
    }

    // day check
    const currentDate = new Date()
    if (dateEdit > currentDate) {
      return res.status(400).send("The date of the event cannot be a future date. Please ensure the date is in the past or present.")
    }

    const savedForm = new Form({
      name,
      location,
      evangelismMethod,
      numOfPeopleReached,
      numOfPeopleSaved,
      numOfPeopleRepent,
      status,
      area,
      date: dateEdit,
      description,
      file: req.file ? req.file.path : null
    })
    await savedForm.save()
    res.status(201).json(savedForm)
  } catch (error) {
    console.error(error)
    throw error
  }
}

exports.GetReachedPeople = async (req, res) => {
  try {
    const reachedPeoples = await Form.find()

    const formattedReachedPeoples = reachedPeoples.map((form) => ({
      ...form.toObject(),
      date: formatDate(form.date)
    }))

    res.status(200).send(formattedReachedPeoples)
  } catch (error) {
    throw error
  }
}

exports.GetIndividual = async (req, res) => {
  try {
    const formId = req.params.id
    const form = await Form.findById(formId)

    if (!form) {
      return res.status(404).send("Form not found")
    }
    const formattedForm = {
      ...form.toObject(),
      date: formatDate(form.date)
    }
    res.status(200).send(formattedForm)
  } catch (error) {
    throw error
  }
}

exports.UpdateIndividual = async (req, res) => {
  try {
    const formId = req.params.id
    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).send("Form not found")
    }
    const { name, location, evangelismMethod, numOfPeopleReached, numOfPeopleSaved, numOfPeopleRepent, status, area, date, description } = req.body
    
    const dateEdit = new Date(date)
    if (isNaN(dateEdit.getTime())) {
      return res.status(400).send("Invalid Date")
    }

    if (numOfPeopleRepent > numOfPeopleReached || numOfPeopleSaved > numOfPeopleReached) {
      return res.status(400).send("The number of people saved or repented cannot be greater than the number of people reached.")
    }

    // day check
    const currentDate = new Date()
    if (dateEdit > currentDate) {
      return res.status(400).send("The date of the event cannot be a future date. Please ensure the date is in the past or present.")
    }

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        name,
        location,
        evangelismMethod,
        numOfPeopleReached,
        numOfPeopleSaved,
        numOfPeopleRepent,
        status,
        area,
        date: dateEdit,
        description,
        file: req.file ? req.file.path : null
      },
      {new: true}
    )
    res.status(200).send(updatedForm)
  } catch (error) {
    throw error
  }
}

exports.DeleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id)
    if(!deletedForm){
      return res.status(404).send('From not found')
    }
    res.status(200).send('Form deleted Succesfully')
  } catch (error) {
    throw error 
  }
}

exports.handleUpload = async (req, res) => {
  try {
    res.json(req.file)
  } catch (error) {
    throw error 
  }
}