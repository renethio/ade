'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


// var statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
// var roomType = ['condo', 'house', 'apartment', 'basement'];

/**
 * Akeray Schema
 */
var AkeraySchema = new Schema({
  description: String,
    // required:true,
    // trim: true
    // enum: roomType
  
  type: {
    type: String,
    default: '',
    required:[true, 'Home type is required'],
    trim: true
  },

  street: String,

  city: {
    type: String,
    required:[true, 'City is required'],
    trim: true},
  state: {
    type: String,
    required: true},

    // uppercase: true,
    // required: true,
    // enum: statesArray
  
  zip: Number,

  
  phone: {
    type: Number,
    required:true},

  price: Number,

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Akeray', AkeraySchema);
