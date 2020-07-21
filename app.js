const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const ErrorResponse = require('./utils/errorResponse');
const getWorker = require('tesseract.js-node');




// Load env vars
dotenv.config({ path: './config/config.env' });

// Change the environment to prodction
if (process.argv[2] == '-p') {
  process.env.NODE_ENV = 'prodction';
}

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  console.log('hey :>> ');
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

  const worker = await getWorker({
    tessdata: './tessdata',    // where .traineddata-files are located
    languages: ['eng']         // languages to load
  });




  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  const image = req.files.image;

  // Check if the file is image
  if (!image.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }

  const text = await worker.recognize(image.data, 'eng');

  console.log(text);

  res.render('res', { text });



});



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in on port ${PORT}`.yellow.bold
  ));

