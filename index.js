const express = require('express')
// import db file for use of connectToMongo function

// include to the file to connect to db
const connectToMongo = require("./db");

// to enable access api through browsers
var cors = require('cors')

const app = express()

//uses cors middleware
app.use(cors())

const port = 5000

// We gotta use midleware to recieve response when params sent to use res.send and to view res.body
// app.use used to use middlewares
app.use(express.json());

// Availiable routes
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Cloudhop book backend running on port http://localhost:${port}`)
})

