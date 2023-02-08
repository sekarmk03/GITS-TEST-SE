const express = require('express');
const router = express.Router();

const auth = require('./auth');
const book = require('./book');
const author = require('./author');
const publisher = require('./publisher');

router.use('/auth', auth);
router.use('/books', book);
router.use('/authors', author);
router.use('/publishers', publisher);

module.exports = router;
