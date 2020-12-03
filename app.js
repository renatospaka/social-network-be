const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();
app.use(bodyParser.json());        //application/json
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form></form>

//setup CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}) 

//main route
app.use('/feed', feedRoutes);

//error handler
app.use((error, req, res, next) => {
  console.log(error);
  const errCode = error.statusCode || 500;
  const message = error.message;
  res.status(errCode).json({ message: message })
}) 
//database access
require('dotenv').config()
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology: true })
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err))

