// import mongoose from 'mongoose'
const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotesSchema = new Schema({
  user:{
    // this field is taked from user schema like a foreign key in mysql
    //its a link between 2 collections 
    type: mongoose.Schema.Types.ObjectId,
    //ref is a refrence to which schema i.e, here user schema
    ref: 'user'
  },
  title:{
    // datatype
    type: String,
    // mandateory feilds 
    required: true
  },
  description:{
    type: String,
    required: true,
  },
  tag:{
    type: String,
    default:'general' //default value
  },
  password:{
    type: Date,
    //Date.now will automatically allocate date but do not call it Date.now() instead just define it Date.now
    default: Date.now
  }
});

// export model
module.exports = mongoose.model('notes', NotesSchema)
// notes => is model name
// NotesSchema => is schema name