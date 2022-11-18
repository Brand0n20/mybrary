const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// All authors
router.get("/", async (req, res) => {
    let searchOptions = {}; // will add request params
    if (req.query.name != null && req.query.name !== '')   { // a get request sends information through a query
        searchOptions.name = new RegExp(req.query.name, 'i')    // the 'i' means that the search is case insensitive( less strict)
    }
        try {
            const authors = await Author.find(searchOptions); // the empty object means that there's no filters in the search
            res.render('authors/index', { authors: authors, 
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
        res.redirect('authors');
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: "Error creating Author"
        })
    }
})

module.exports = router