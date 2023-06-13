//import express
const express = require('express');
//import express validator to validate data recieved on post
const { body, validationResult } = require('express-validator');
// import bcrytjs for password hashing, salt, and pepper
const bcrypt = require('bcryptjs');
// import user model
const User = require("../models/User")
//import router from express
const router = express.Router()
//import fetchuser middleware
const fetchuser = require('../middleware/fetchuser');
//import JWT package
const jwt = require('jsonwebtoken');

// JWT secret key/signature
const JWT_SECRET = 'Top$ecret'

// we use router.get instead of application.get since we use router functions

// router.get('/', (req, res) => {
    // return json response
    // res.json(obj)
    // console.log(req.body);
    // res.send("hello from auth")
// })

// sample
// (req, res) => {
//     console.log(req.body);
//     // fetch model to insert
//     const user = User(req.body);
//     user.save();
//     res.send(req.body);
// }



//ROUTE 1: Create user using: POST "api/auth/createuser". No Login required.
// We use aarray to validate multiple fields
router.post('/createuser', [
    // syntax
    // body("param name","custom error message")

    body('name', "Enter a valid Name").isLength({min: 3}),    // Check length
    body('email', "Enter a valid email").isEmail(),            // check for email type
    body('password', "Enter a valid Password").isLength({min: 5}) // check for passwoed length
], async(req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {  
    // check whether user with this email exists already.
    let user = await User.findOne({email: req.body.email});
    if(user){
      // return error if user exist
      return res.status(400).json({error:"Sorry a user with this email already exists!"})
    }

    // Password hashing using bcrypt js
    // generate salt
    const salt = await bcrypt.genSalt(10);
    
    // generate password hash
    const secPass = await bcrypt.hash(req.body.password, salt);

    // else insert new user.
    user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      })
      //.then not required since we use async and await.
      // .then(user => res.json(user))
      // .catch(err => {
      //   // returns error message
      //   res.send({message:"invalid email/ email not unique", error_message:err.message});
      // })

      // assigin user id
      const data = {
        user:{
          id:user.id
        }
      }

      // JWT sign for generating auth token
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      // return authtoken
      res.json({authtoken});

    } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal Server Error")
    }
})

//ROUTE 2: Authenticate a user using: POST "api/auth/login". No Login required.
router.post('/login', [
  // syntax
  // body("param name","custom error message")

  // Check length
  body('email', "Enter a valid email").isEmail(),            // check for email type
  body('password', "Password cannot be blank").exists() // check for password empty or not
], async(req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  // If there are errors, return bad request and the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructure request
  const {email, password} = req.body;

  try {
    // check for inputted user exist or not
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Please try to login with correct credentials!"});
    }

    // compare password has with input password

    const passwordCompare = await bcrypt.compare(password, user.password);
    
    if(!passwordCompare){
      return res.status(400).json({error: "Please try to login with correct credentials!"});
    }

    // if email and password correct store user data
    // assigin user id
    //payload
    const data = {
      user:{
        id:user.id
      }
    }

    // JWT sign for generating auth token
    const authtoken = jwt.sign(data, JWT_SECRET);

    // return authtoken
    res.json({authtoken});

    
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }

})

//ROUTE 3: Get logged in  user details using: POST "api/auth/getuser". Login required.
//fetch user is a middleware which is used to fetch user data 
router.post('/getuser', fetchuser, async(req,res) => {
try {
  userId = req.user.id; //store user id
  const user = await User.findById(userId).select("-password") //.select() can be used to omit certain fields, here we fetch all feilds except password.
  res.send(user);
} catch (error) {
  console.error(error,message);
  res.status(500).send("Internal Server error")  
}
})


// export router
module.exports = router;