const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// All authors
router.get("/", (req, res) => {
    res.render('authors/index');    // renders the index JUST for the authors
})

// New Author Route
router.get("/new", (req, res) => {
    res.render('authors/new', { author: new Author()});
})

// Create Author Route
router.post('/', (req, res) => {
    res.send(req.body.name);
})

module.exports = router