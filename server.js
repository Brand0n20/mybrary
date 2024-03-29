if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  // will load all varaibles from .env file here
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');  // calls the index.js file
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books')

app.set('view engine', 'ejs'); //setting our view engine
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');    //every single file will be put in side this layout file so we don't duplicate beginning ending HTML
app.use(expressLayouts); 
app.use(express.static('public'));  //folder for uploads and style sheets
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

const mongoose = require('mongoose');

// you want to connect to a server that's on the web somewhere
// you need to download a library called 'dotenv' that will load enviroment variables into our application
mongoose.connect(process.env.DATABASE_URL, {    
    useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter);  // index router will handle this path
app.use('/authors', authorRouter);   // every route under the authors will start off with the '/authors' alrady implemented
app.use('/books', bookRouter);


app.listen(process.env.PORT || 3000);