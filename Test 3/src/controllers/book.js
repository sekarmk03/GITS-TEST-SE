const { Book, Author, Publisher } = require('../models');
const { Op } = require('sequelize');
const schema = require('../validation_schema');
const Validator = require('fastest-validator');
const v = new Validator;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "title", type = "ASC", search = ""
            } = req.query;

            const books = await Book.findAll({
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
                ]
            });

            return res.status(200).json({
                status: 'OK',
                message: 'Get All Books Success',
                data: books
            });
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

            return res.status(200).json({
                status: 'OK',
                message: 'Get Book Success',
                data: book.get()
            });
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
                pub_year,
                pub_id
            });

            return res.status(201).json({
                status: 'CREATED',
                message: 'New Book Created',
                data: created
            });
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

            const updated = await Book.update({
                isbn,
                title,
                pub_year,
                pub_id
            }, {
                where: {
                    id: id
                }
            })

            return res.status(200).json({
                status: 'OK',
                message: 'Update Book Success',
                data: updated
            })
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

            const deleted = await Book.destroy({
                where: {
                    id: id
                }
            });

            return res.status(200).json({
                status: 'OK',
                message: 'Delete Book Success',
                data: deleted
            });
        } catch (err) {
            next(err);
        }
    }
}