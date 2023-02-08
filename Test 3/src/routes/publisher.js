const express = require('express')
const router = express.Router()
const c = require('../controllers')
const authorize = require('../middleware/authorize');
const roles = require('../utils/user_role');

// get all publishers data
router.get('/', authorize(), c.publisher.index)

// get detail publisher data
router.get('/:id', authorize(), c.publisher.show)

// create publisher data
router.post('/', authorize([roles.admin, roles.superadmin]), c.publisher.create)

// update publisher data
router.put('/:id', authorize([roles.admin, roles.superadmin]), c.publisher.update)

// delete publisher data
router.delete('/:id', authorize([roles.admin, roles.superadmin]), c.publisher.delete)

module.exports = router