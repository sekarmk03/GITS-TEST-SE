const { Publisher, Book, Author } = require('../models');
const { Op } = require('sequelize');
const schema = require('../validation_schema');
const Validator = require('fastest-validator');
const halson = require('halson');
const v = new Validator;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "name", type = "ASC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const publishers = await Publisher.findAndCountAll({
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
                        model: Author,
                        as: 'author',
                        attributes: ['name', 'email']
                    }
                },
                limit: limit,
                offset: start
            });

            let count = publishers.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = publishers.rows.length;

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

            const publisherResources = publishers.rows.map((pub) => {
                const publisherResource = halson(pub.toJSON()).addLink('self', `/publishers/${pub.id}`).addLink('books', `/publishers/${pub.id}/books`);

                return publisherResource;
            });

            const response = {
                status: 'OK',
                message: 'Get All Publishers Success',
                pagination,
                data: publisherResources,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'}
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        try {
            const { id } = req.params;
            const publisher = await Publisher.findOne({
                where: { id: id },
                include: {
                    model: Book,
                    as: 'books',
                    attributes: ['id', 'isbn', 'title', 'pub_year'],
                    include: {
                        model: Author,
                        as: 'author',
                        attributes: ['name', 'email']
                    }
                }
            });

            if (!publisher) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Publisher Didn't Exist`,
                    data: null
                });
            }

            const publisherResource = halson(publisher.toJSON()).addLink('self', `/publishers/${publisher.id}`).addLink('books', `/publishers/${publisher.id}/books`);

            const books = publisher.books.map((book) => {
                return halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('publisher', `/publishers/${id}`);
            });

            const response = {
                status: 'OK',
                message: 'Get Publisher Success',
                data: { ...publisherResource, books },
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'}
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
            const booksPub = await findAll({where: {pub_id: id}});
            
            const bookPubResources = booksPub.map((book) => {
                const bookPubResource = halson(book.toJSON()).addLink('self', `/books/${book.id}`).addLink('publisher', `/publishers/${id}`);

                return bookPubResource;
            })

            const response = {
                status: 'OK',
                message: 'Get Books Publisher Success',
                data: bookPubResources,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { name, email, city, zip_code } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.publisher.createPublisher);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const created = await Publisher.create({
                name,
                email,
                city,
                zip_code
            });

            const publisherResource = halson(created.toJSON()).addLink('self', `/publishers/${created.id}`).addLink('books', `/publishers/${created.id}/books`);

            const response = {
                status: 'CREATED',
                message: 'New Publisher Created',
                data: publisherResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'},
                    created: {href: `/publishers/${created.id}`}
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
            let { name, email, city, zip_code } = req.body;

            const body = req.body;
            const validate = v.validate(body, schema.publisher.updatePublisher);

            if (validate.length) {
                return res.status(400).json(validate);
            }

            const publisher = await Publisher.findOne({ where: { id: id } });
            if (!publisher) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Publisher Didn't Exist`,
                    data: null
                })
            }

            if (!name) name = publisher.name;
            if (!email) email = publisher.email;
            if (!city) city = publisher.city;
            if (!zip_code) zip_code = publisher.zip_code;

            await publisher.update({
                name,
                email,
                city,
                zip_code
            });

            const publisherResource = halson(publisher.toJSON()).addLink('self', `/publishers/${publisher.id}`).addLink('books', `/publishers/${publisher.id}/books`);

            const response = {
                status: 'OK',
                message: 'Update Publisher Success',
                data: publisherResource,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'},
                    updated: {href: `/publishers/${publisher.id}`}
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

            const publisher = await Publisher.findOne({
                where: {
                    id: id
                }
            });

            if (!publisher) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Publisher Didn't Exist`,
                    data: null
                });
            }

            await publisher.destroy();

            const response = {
                status: 'OK',
                message: 'Delete Publisher Success',
                data: null,
                links: {
                    self: {href: req.originalUrl},
                    collection: {href: '/publishers'},
                    deleted: {href: `/publishers/${publisher.id}`}
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}