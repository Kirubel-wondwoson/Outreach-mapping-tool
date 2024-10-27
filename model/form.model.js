const mongoose = require('mongoose')

const FormSchema = mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon', 'Circle'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    radius: {
      type: Number,
      required: function() {return this.type === 'Circle'}
    }
  },
  evangelismMethod:{
    type: String,
    enum: ['oneToOneOutreach','massOutreach'],
    required: true 
  },
  numOfPeopleReached: {
    type: Number,
    required: true 
  },
  numOfPeopleSaved: {
    type: Number,
    required: true
  },
  numOfPeopleRepent: {
    type: Number,
    required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'InActive'],
    default: 'Active'
  },
  date: {
    type: Date,
    required: true 
  },
  description: {
    type: String,
    required: true 
  },
  file: {
    type: String
  }
}, {timestamps: true})

const Form = mongoose.model("Form", FormSchema)

module.exports = Form