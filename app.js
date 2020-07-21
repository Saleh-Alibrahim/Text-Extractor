const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const ocrad = require('async-ocrad');


// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');









// Routes

app.get('', (req, res, next) => {
  res.render('index');
});

app.post('/', async (req, res, next) => {

  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }
  const file = req.files.file;

  // Check if the file is image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }




});



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in on port ${PORT}`.yellow.bold
  ));

