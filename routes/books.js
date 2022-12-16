const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Books
router.get("/", async (req, res) => {
    let query = Book.find();    // lines 19-21 is to querying the title of the books
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    // checking if the publishDate of any books is less than the date of the publishedBefore and then will return that date
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);    // 'lte' means less than or equal to
    }
    // checking if the publishDate of any books is greater than the date of the publishedAfter value entered in the search
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);    // 'gte' means greater than or equal to
    }
    try {
        const books = await query.exec();  // the 'await' key is very important
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (err) {
        console.log(err);
        res.redirect('/')
    }
})

// New Book Form Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
})

// Post Request
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = (req.file != null ? req.file.filename : null)
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName, 
        description: req.body.description
    })

    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`)
    } catch(err) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)    // prevents a new cover from being added when the post fails
        }
        console.log(err);
        renderNewPage(res, book, true);
    }
})

// Show book Route
router.get('/:id', async (req, res) => {
    try {
        // will find the book by its id and then will populate the author field with all the author information
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', { book: book });
    } catch (err) {
        res.redirect('/')
    }
})

// Edit Book Route
router.get("/:id/edit", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    } catch {
        res.redirect('/');
    }
   
})

// Put Request
router.put('/:id', upload.single('cover'), async (req, res) => {
    const fileName = (req.file != null ? req.file.filename : null)
    let book;
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        book.coverImageName = fileName;
        await book.save();
        res.redirect(`/books/${book.id}`)
    } catch(err) {
        if (book != null) {
            renderEditPage(res, book, true);
        } else {
            res.redirect('/');
        }
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)    // prevents a new cover from being added when the post fails
        }
        console.log(err);
        renderNewPage(res, book, true);
    }
})

// Deletes Book
router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
    } catch {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/');
        }
    }



})

const renderNewPage = (res, book, hasError = false) => {
    renderFormPage(res, book, 'new', hasError);
}

const renderEditPage = (res, book, hasError = false) => {
    renderFormPage(res, book, 'edit', hasError);
}

const renderFormPage = async (res, book, form, hasError = false) => {
    try {
        const authors = await Author.find({})
        const params = {   
        authors: authors,
        book: book             
        }; 

        if (hasError) {
            if (form === 'edit') {
                params.errorMessage ='Error updating book';
            } else {
                params.errorMessage ='Error creating book';
            }
        }
        res.render(`books/${form}`, params);
    } catch {
        res.redirect('/books')
    }
}

const removeBookCover = (fileName) => {
    fs.unlink(path.join(uploadPath, fileName) , err => {
        if (err) console.log(err);
    })  //will get rid of the file name inside the upload path which is 'public/uploads/bookCover
}


module.exports = router

