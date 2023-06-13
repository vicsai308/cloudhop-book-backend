// getting-started.js
// import mongoose package
const mongoose = require('mongoose');

//Define mongo URI from compass or atlass
mongoURI="mongodb://localhost:27017/cloudhopbook";

connectToMongo().catch(err => console.log(err));

async function connectToMongo() {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully")
    }

