//import express
const express = require('express');
//import fetchuser middleware
const fetchuser = require('../middleware/fetchuser');
//import notes model
const Note = require('../models/Notes');
//import router from express
const router = express.Router()
//import express validator to validate data recieved on post
const { body, validationResult } = require('express-validator');

// we use router.get instead of application.get since we use router functions

//ROUTE 1: Get all notes using: GET "api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        if (!notes) {
            res.status(400).json({ error: "Notes does not exist" })
        }
        res.json(notes);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE 2: Add new note using: POST "api/notes/addnote". Login required.
router.post('/addnote', fetchuser, [
    // syntax
    // body("param name","custom error message")
    body('title', "Enter a valid title").isLength({ min: 3 }),    // Check length           
    body('description', "Description must be atleast 5 characters.").isLength({ min: 5 }) // check for description length
], async (req, res) => {

    try {

        // store req.body values
        const { title, description, tag } = req.body;

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // If there are errors, return bad request and the errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // assighn values to schema
        const note = new Note({
            title, description, tag, user: req.user.id
        })

        // push the newly assihned values schema to mongodb to create a new note
        const savedNote = await note.save()

        res.json(savedNote);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})

//ROUTE 3: Update an existing note using: PUT "api/notes/updatenote". Login required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    // capture put data
    const { title, description, tag } = req.body;
    try {
        //create a newNote object
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (tag) { newnote.tag = tag };


        //find the note to be updated and update it usind req.params.id from put.
        let note = await Note.findById(req.params.id);

        if (!note) {
            //if no notes exist.
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            //allow update only if user owns this note
            return res.status(401).send("Not Allowed");
        }
        //update using req.params.id, $set assigned with updated object of values and new option to true to return the document after update was applied.
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.send(note);

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})


//ROUTE 4: Delete an existing note using: DELETE "api/notes/deletenote". Login required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //find the note to be deleted and delete it usind req.params.id from Delete.
        let note = await Note.findById(req.params.id);

        if (!note) {
            //if no notes exist.
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            //allow delete only if user owns this note
            return res.status(401).send("Not Allowed");
        }
        //delete using req.params.id.
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})


// export router
module.exports = router;