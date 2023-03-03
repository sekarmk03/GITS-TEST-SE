const { Author, Book, Publisher } = require('../models');
const { Op } = require('sequelize');
const schema = require('../validation_schema');
const Validator = require('fastest-validator');
const halson = require('halson');
const v = new Validator;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "name", type = "ASC", search = "", page  = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const authors = await Author.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                include: {
                    model: Book,
                    as: 'books',
                    attributes: ['id', 'isbn', 'title', 'pub_year'],
                    include: {
                        model: Publisher,
                        as: 'publisher',
                        attributes: ['name', 'city']
                    }
                },
                limit: limit,
                offset: start
            });

            let count = authors.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = authors.rows.length;

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

            const authorResources = authors.rows.map((author) => {
                const authorResource = halson(author.toJSON()).addLink('self', `/authors/${author.id}`).addLink('books', `/authors/${author.id}/books`);

                return authorResource;
            });

            const response = {
                status: 'OK',
                message: 'Get All Authors Success',
                pagination,
                data: authorResources,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'}
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
            const author = await Author.findOne({
                where: { id: id },
                include: {
                    model: Book,
                    as: 'books',
                    attributes: ['id', 'isbn', 'title', 'pub_year'],
                    include: {
                        model: Publisher,
                        as: 'publisher',
                        attributes: ['name', 'city']
                    }
                }
            });

            if (!author) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Author Didn't Exist`,
                    data: null
                });
            }

            const authorResource = halson(author.toJSON()).addLink('self', `/authors/${author.id}`).addLink('books', `/authors/${author.id}/books`);

            const books = author.books.map((book) => {
                return halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('author', `/authors/${id}`);
            });

            const response = {
                status: 'OK',
                message: 'Get Author Success',
                data: { ...authorResource, books },
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    getBooks: async (req, res, next) => {
        try {
            const { id } = req.params;
            const booksAuthor = await findAll({where: {author_id: id}});
            
            const bookAuthorResources = booksAuthor.map((book) => {
                const bookAuthorResource = halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('author', `/authors/${id}`);

                return bookAuthorResource;
            })

            const response = {
                status: 'OK',
                message: 'Get Books Author Success',
                data: bookAuthorResources,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { name, email, age, gender } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.author.createAuthor);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const created = await Author.create({
                name,
                email,
                age,
                gender
            });

            const authorResource = halson(created.toJSON()).addLink('self', `/authors/${created.id}`).addLink('books', `/authors/${created.id}/books`);

            const response = {
                status: 'CREATED',
                message: 'New Author Created',
                data: authorResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'},
                    created: {href: `/authors/${created.id}`}
                }
            }

            return res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            let { name, email, age, gender } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.author.updateAuthor);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const author = await Author.findOne({ where: { id: id } });
            if (!author) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Author Didn't Exist`,
                    data: null
                })
            }

            if (!name) name = author.name;
            if (!email) email = author.email;
            if (!age) age = author.age;
            if (!gender) gender = author.gender;

            await author.update({
                name,
                email,
                age,
                gender
            });

            const authorResource = halson(author.toJSON()).addLink('self', `/authors/${author.id}`).addLink('books', `/authors/${author.id}/books`);

            const response = {
                status: 'OK',
                message: 'Update Author Success',
                data: authorResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'},
                    updated: {href: `/authors/${author.id}`}
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

            const author = await Author.findOne({
                where: {
                    id: id
                }
            });

            if (!author) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Author Didn't Exist`,
                    data: null
                });
            }

            author.destroy();

            const response = {
                status: 'OK',
                message: 'Delete Author Success',
                data: null,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/authors'},
                    deleted: {href: `/authors/${author.id}`}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}