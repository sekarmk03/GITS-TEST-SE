const { Book, Author, Publisher } = require('../models');
const { Op } = require('sequelize');
const schema = require('../validation_schema');
const Validator = require('fastest-validator');
const halson = require('halson');
const v = new Validator;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "title", type = "ASC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const books = await Book.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                include: [
                    {
                        model: Author,
                        as: 'author',
                        attributes: ['name', 'email']
                    },
                    {
                        model: Publisher,
                        as: 'publisher',
                        attributes: ['name', 'city']
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = books.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = books.rows.length;

            if (end < count) {
                pagination.next = {
                    page: page + 1
                }
            }
            if (start > 0) {
                pagination.prev = {
                    page: page - 1
                }
            }

            const bookResources = books.rows.map((book) => {
                const bookResource = halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('author', `/authors/${book.author_id}`);

                return bookResource;
            });

            const response = {
                status: 'OK',
                message: 'Get All Books Success',
                pagination,
                data: bookResources,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/books'}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        try {
            const { id } = req.params;
            const book = await Book.findOne({
                where: { id: id },
                include: [
                    {
                        model: Author,
                        as: 'author',
                        attributes: ['name', 'email']
                    },
                    {
                        model: Publisher,
                        as: 'publisher',
                        attributes: ['name', 'city']
                    }
                ]
            });

            if (!book) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Book Didn't Exist`,
                    data: null
                });
            }

            const bookResource = halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('author', `/authors/${book.author_id}`);

            const response = {
                status: 'OK',
                message: 'Get Book Success',
                data: bookResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/books'}
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { isbn, title, author_id, pub_year, pub_id } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.book.createBook);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const book = await Book.findOne({ where: { isbn } });

            if (book) {
                return res.status(409).json({
                    status: 'CONFLICT',
                    message: 'Data Already Exist',
                    data: null
                });
            }

            const created = await Book.create({
                isbn,
                title,
                author_id,
                pub_year,
                pub_id
            });

            const bookResource = halson(created.toJSON()).addLink('self', `/books/${created.id}`).addLink('author', `/authors/${created.author_id}`);

            const response = {
                status: 'CREATED',
                message: 'New Book Created',
                data: bookResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/books'},
                    created: {href: `/books/${created.id}`}
                }
            };

            return res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            let { isbn, title, pub_year, pub_id } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.book.updateBook);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const book = await Book.findOne({ where: { id: id } });
            if (!book) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Book Didn't Exist`,
                    data: null
                })
            }

            if (!isbn) isbn = book.isbn;
            if (!title) title = book.title;
            if (!pub_year) pub_year = book.pub_year;
            if (!pub_id) pub_id = book.pub_id;

            await book.update({
                isbn,
                title,
                pub_year,
                pub_id
            });

            const bookResource = halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('author', `/authors/${book.author_id}`);

            const response = {
                status: 'OK',
                message: 'Update Book Success',
                data: bookResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/books'},
                    updated: {href: `/books/${book.id}`}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            const book = await Book.findOne({
                where: {
                    id: id
                }
            });

            if (!book) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Book Didn't Exist`,
                    data: null
                });
            }

            await book.destroy();

            const response = {
                status: 'OK',
                message: 'Delete Book Success',
                data: null,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/books'},
                    deleted: {href: `/books/${book.id}`}
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}