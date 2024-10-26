const mongoose = require('mongoose')

const FormSchema = mongoose.Schema({
  name: {
    type: String,
    required: function() {return this.evangelismMethod === 'oneToOneOutreach'}
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
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
    default: 'Active',
    required: true 
  },
  area: {
    type: Number,
    required: true
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