// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    // datatype
    type: String,
    // mandateory feilds 
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true //does not accept duplicate values
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    //Date.now will automatically allocate date but do not call it Date.now() instead just define it Date.now
    default: Date.now
  }
});

// export model
const User = mongoose.model('user', UserSchema)
//Creates indexes for all entries which will only store unique values
//we write logic in route itself for uniqure email entry.
// User.createIndexes();
module.exports = User;
// module.exports = mongoose.model('user', UserSchema)
// user => is model name
// UserSchema => is schema name