const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const ocrad = require('async-ocrad');
const ErrorResponse = require('./utils/errorResponse')


// Load env vars
dotenv.config({ path: './config/config.env' });

// Change the environment to prodction
if (process.argv[2] === '-p') {
  process.env.NODE_ENV = 'prodction';
}

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));

process.env.NODE_ENV = 'development';

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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/', async (req, res, next) => {

  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }
  const image = req.files.image;

  const text = await ocrad(image.data.toString());

  // Move the photo to the public folder
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    // Update the bootcamp photo name
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: updatedBootcamp
    });
  });

  console.log(text);


  // Check if the file is image
  if (!image.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }





});



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in on port ${PORT}`.yellow.bold
  ));

