const { Publisher, Book, Author } = require('../models');
const { Op } = require('sequelize');
const schema = require('../validation_schema');
const Validator = require('fastest-validator');
const v = new Validator;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "name", type = "ASC", search = ""
            } = req.query;

            const publishers = await Publisher.findAll({
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
                    attributes: ['title', 'pub_year'],
                    include: {
                        model: Author,
                        as: 'author',
                        attributes: ['name', 'email']
                    }
                }
            });

            return res.status(200).json({
                status: 'OK',
                message: 'Get All Publishers Success',
                data: publishers
            });
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
                    attributes: ['title', 'pub_year'],
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

            return res.status(200).json({
                status: 'OK',
                message: 'Get Publisher Success',
                data: publisher.get()
            });
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

            return res.status(201).json({
                status: 'CREATED',
                message: 'New Publisher Created',
                data: created
            });
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

            const updated = await Publisher.update({
                name,
                email,
                city,
                zip_code
            }, {
                where: {
                    id: id
                }
            })

            return res.status(200).json({
                status: 'OK',
                message: 'Update Publisher Success',
                data: updated
            })
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

            const deleted = await Publisher.destroy({
                where: {
                    id: id
                }
            });

            return res.status(200).json({
                status: 'OK',
                message: 'Delete Publisher Success',
                data: deleted
            });
        } catch (err) {
            next(err);
        }
    }
}