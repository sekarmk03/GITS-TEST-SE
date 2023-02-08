module.exports = {
    register: {
        name: 'string',
        email: 'email',
        password: 'string|min:8',
        role: { optional: true, type: 'string', enum: ['user', 'admin']}
    }
}