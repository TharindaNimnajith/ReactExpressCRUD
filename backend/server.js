const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const UserRoutes = require('./routes/user-routes')

require('dotenv').config()

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())
app.use(cors())

app.use('/api', UserRoutes)

const uri = process.env.ATLAS_URI
const port = process.env.PORT || 5000

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  dbName: 'railway_ticket_booking_app'
}

mongoose
  .connect(uri, options)
  .then(() => {
    app.listen(port)
    console.log(`Server is running on port: ${port}`)
  })
  .catch((error) => {
    console.log(error)
  })
