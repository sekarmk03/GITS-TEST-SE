module.exports = {
    createAuthor: {
        name: 'string',
        email: 'email',
        age: 'number',
        gender: {type: 'string', enum: ['Male', 'Female']}
    },
    updateAuthor: {
        name: {optional: true, type: 'string'},
        email: {optional: true, type: 'email'},
        age: {optional: true, type: 'number'},
        gender: {optional: true, type: 'string', enum: ['Male', 'Female']}
    },
}