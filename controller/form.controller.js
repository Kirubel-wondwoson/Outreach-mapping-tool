const Form = require('../model/form.model');
const User = require('../model/user.model');
const fs = require('fs')
const path = require('path')

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

exports.CreateNewForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const {location, evangelismMethod, numOfPeopleReached, numOfPeopleSaved, numOfPeopleRepent, date, description} = req.body

    const dateEdit = new Date(date)
    if (isNaN(dateEdit.getTime())) {
      return res.status(400).send("Invalid Date")
    } 
   
    // if (numOfPeopleRepent > numOfPeopleReached || numOfPeopleSaved > numOfPeopleReached) {
    //   return res.status(400).send("The number of people saved or repented cannot be greater than the number of people reached.")
    // }

    // day check
    const currentDate = new Date()
    if (dateEdit > currentDate) {
      return res.status(400).send("The date of the event cannot be a future date. Please ensure the date is in the past or present.")
    }

    const locationFormatted = JSON.parse(req.body.location);
    
    const savedForm = new Form({
      name: user.username,
      location: locationFormatted,
      evangelismMethod,
      numOfPeopleReached, 
      numOfPeopleSaved,  
      numOfPeopleRepent,
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
    const reachedPeoples = await Form.find({status: "Active"})

    const formattedReachedPeoples = await Promise.all(reachedPeoples.map(async form => {
      const filePath = form.file ? form.file.replace(/\\/g, "/") : null;
      const fileData = filePath ? await fs.promises.readFile(filePath) : null; 
      return {
        ...form.toObject(),
        file: fileData ? `data:${path.extname(filePath).slice(1)};base64,${fileData.toString('base64')}` : null, 
        date: formatDate(form.date) 
      };
    }));
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

    const filePath = form.file ? form.file.replace(/\\/g, "/") : null;
    const fileData = filePath ? await fs.promises.readFile(filePath) : null; // Read the file data

    const formattedForm = {
      ...form.toObject(),
      file: fileData ? `data:${path.extname(filePath).slice(1)};base64,${fileData.toString('base64')}` : null, // Convert to base64
      date: formatDate(form.date)
    };
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
    const {name, location, evangelismMethod, numOfPeopleReached, numOfPeopleSaved, numOfPeopleRepent, status, date, description } = req.body
    
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

