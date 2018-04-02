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
var ChildcareSchema = new Schema({
  address: {
    type: String,
    default: '',
    required: 'Address',
    trim: true
  },

  describe: {
    type: String,
    required: "Please describe yourself"
  },
  type: {
    type: String,
    required: "Describe how you will babysit"
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

mongoose.model('Childcare', ChildcareSchema);






























// 'use strict';

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;

// /**
//  * Childcare Schema
//  */
// var ChildcareSchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill Childcare name',
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

// mongoose.model('Childcare', ChildcareSchema);
