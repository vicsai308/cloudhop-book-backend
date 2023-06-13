// import mongoose package
const mongoose = require('mongoose');

//Define mongo URI from compass or atlass
const mongoURI = "mongodb://localhost:27017/cloudhopbook/?directConnection=true"

// function to connect db. We can use async await, promises or callback function

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully")
    })
}

// export the module
module.export.connectToMongo = connectToMongo;


