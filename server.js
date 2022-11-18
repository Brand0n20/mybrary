if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  // will load all varaibles from .env file here
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');  // calls the index.js file
const authorRouter = require('./routes/authors');

app.set('view engine', 'ejs'); //setting our view engine
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded( { limit: '10mb', extended: false }));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter);  // index router will handle this path
app.use('/authors', authorRouter)   // every route under the authors will start off with the '/authors' alrady implemented


app.listen(3000);