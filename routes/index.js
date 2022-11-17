const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    console.log("Here");
    res.render('index');
})

module.exports = router