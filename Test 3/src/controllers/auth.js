const bcrypt = require('bcrypt');
const roles = require('../utils/user_role');
const { User } = require('../models');
const schema = require('../validation_schema')
const Validator = require('fastest-validator')
const v = new Validator;

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, role = roles.user } = req.body;

            const exist = await User.findOne({ where: { email: email } });

            if (exist) {
                return res.status(400).json({
                    status: 'BAD_REQUEST',
                    message: 'User Already Exist',
                    data: null
                });
            }

            const body = req.body;
            const validate = v.validate(body, schema.auth.register) //password min:8

            if (validate.length) {
                return res.status(400).json(validate)
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                password: hashedPass,
                role
            });

            return res.status(201).json({
                status: 'CREATED',
                message: 'User Registered',
                _links: {
                    login: '/auth/login',
                    check_user: '/auth/whoami'
                },
                data: {
                    id: newUser.id,
                    name: newUser.email,
                    password: newUser.password,
                    role: newUser.role,
                }
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const user = await User.authenticate(req.body);
            const accessToken = user.generateToken();

            return res.status(200).json({
                status: 'OK',
                message: 'Login Success',
                _links: {
                    register: '/auth/register',
                    check_user: '/auth/whoami'
                },
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: accessToken,
                }
            });
        } catch (err) {
            next(err);
        }
    },

    whoami: (req, res, next) => {
        try {
            const currentUser = req.user;

            return res.status(200).json({
                status: 'OK',
                message: 'user found',
                _links: {
                    login: '/auth/login',
                    register: '/auth/register'
                },
                data: {
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.role,
                }
            });
        } catch (err) {
            next(err);
        }
    },

}