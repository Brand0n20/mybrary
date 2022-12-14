const express = require('express');
const router = express.Router();
const Book = require('../models/book')


router.get("/", async (req, res) => {
    let books = [];
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();     //ordering the books created At in descending order and only the first 10
    } catch (err) {
        console.log(err);
        books = [];
    }
    res.render('index', { books: books });
})

module.exports = router