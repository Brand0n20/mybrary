const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';    

// creates a schema for book
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    }, 
    pageCount: {
        type: Number,
        required: true
    }, 
    createdAt: {    // this is referring to when the book was added to the database
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,    // this is refferecing the author id from the author collection
        required: true,
        ref: 'Author'   // this must match the model name of the Author model
    }
})

bookSchema.virtual('coverImagePath').get(function() {       // Virtual property, need a regular function to use the .this  property
if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)  // accesses the image path
}
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath