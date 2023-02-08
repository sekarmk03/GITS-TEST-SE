const express = require('express')
const router = express.Router()
const c = require('../controllers')
const authorize = require('../middleware/authorize');
const roles = require('../utils/user_role');

// get all books data
router.get('/', authorize(), c.book.index)

// get detail book data
router.get('/:id', authorize(), c.book.show)

// create book data
router.post('/', authorize([roles.admin, roles.superadmin]), c.book.create)

// update book data
router.put('/:id', authorize([roles.admin, roles.superadmin]), c.book.update)

// delete book data
router.delete('/:id', authorize([roles.admin, roles.superadmin]), c.book.delete)

module.exports = router