const mongoose = require('mongoose');
const Book = require('./book');

// creates a schema for our author
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {     // the 'pre' means that this function will run before the remove request
    Book.find({ author: this.id }, (err, books) => {    // finding books whose author id matches THIS current author id
        if (err) {
            next(err)
        } else if (books.length > 0) {  // if it found books with that author id
            next(new Error('This author has books still'))
        } else {
            next();     // this means that it's okay to continue and remove the author
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)