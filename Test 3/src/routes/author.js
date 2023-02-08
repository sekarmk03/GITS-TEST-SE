const express = require('express')
const router = express.Router()
const c = require('../controllers')
const authorize = require('../middleware/authorize');
const roles = require('../utils/user_role');

// get all authors data
router.get('/', authorize(), c.author.index)

// get detail author data
router.get('/:id', authorize(), c.author.show)

// create author data
router.post('/', authorize([roles.admin, roles.superadmin]), c.author.create)

// update author data
router.put('/:id', authorize([roles.admin, roles.superadmin]), c.author.update)

// delete author data
router.delete('/:id', authorize([roles.admin, roles.superadmin]), c.author.delete)

module.exports = router