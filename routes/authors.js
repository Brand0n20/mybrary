const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

// All authors
router.get("/", async (req, res) => {
    let searchOptions = {}; // will add request params
    if (req.query.name != null && req.query.name !== '')   { // a get request sends information through a query
        searchOptions.name = new RegExp(req.query.name, 'i')    // the 'i' means that the search is case insensitive( less strict)
    }
        try {
            const authors = await Author.find(searchOptions); // the empty object means that there's no filters in the search
            res.render('authors/index', {
                authors: authors, 
                searchOptions: req.query
             })   // renders the index JUST for the authors and sends the authors and searchOptions to that file
        } catch {
            res.redirect('/');
        }
     
})

// New Author Route
router.get("/new", (req, res) => {
    res.render('authors/new', { author: new Author()});
})

// Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save();  // wait for author.save to finish and then pupulate the newAuthor variable
        res.redirect(`authors/${newAuthor.id}`);
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: "Error creating Author"
        })
    }
})

router.get('/:id', async (req, res) => {  // get routes for 'id' must always go after any other get routes
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', { author: author, booksByAuthor: books })
    } catch (err) {
        res.redirect('/');
        throw err; 
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors');
    }
    
})

// Need to donwload a library for put and delete requests since the browser doesn't support them
// Update Route
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();  // wait for author.save to finish
        res.redirect(`/authors/${author.id}`);
    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: "Error updating Author"
            })
        }
    }
})

// Delete Router
router.delete('/:id', async (req, res) => {
    let author;
    let errorMessage;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();  // will delete the author from the database
        res.redirect('/authors');
    } catch {
        if (author == null) {
            res.redirect('/');
        } else {
            let searchOptions = {};
            const authors = await Author.find(searchOptions); // the empty object means that there's no filters in the search
            res.render('authors/index', {
                authors: authors, 
                searchOptions: req.query,
                errorMessage: `${author.name} has a book in the database so it can't be deleted`
        })
        }
    }
})


module.exports = router