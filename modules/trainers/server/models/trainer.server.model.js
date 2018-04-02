

'use strict';

/**
 * Module dependencies.
 */
var statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Liyu Schema
 */
var TrainerSchema = new Schema({
  name: {
    type: String,
    required: "Please state your name"
  },
  
  address: {
    type: String,
    default: '',
    required: 'Please fill your address',
    trim: true
  },

  describe: {
    type: String,
    required: "Please describe about yourself"
  },

  // street: String,
  // city: String,
  // state: {
  //   type: String,
  //   uppercase: true,
  //   required: true,
  //   enum: statesArray
  // },
  // zip: Number,

  phone: {
    type: Number,
    required: "Please fill your phone number"

  },

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Trainer', TrainerSchema);














// 'use strict';


// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;

// /**
//  * Trainer Schema
//  */
// var TrainerSchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill Trainer name',
//     trim: true
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   }
// });

// mongoose.model('Trainer', TrainerSchema);
