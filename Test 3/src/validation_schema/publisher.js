module.exports = {
    createPublisher: {
        name: 'string',
        email: 'email',
        city: 'string',
        zip_code: 'string'
    },
    updatePublisher: {
        name: {optional: true, type: 'string'},
        email: {optional: true, type: 'email'},
        city: {optional: true, type: 'string'},
        zip_code: {optional: true, type: 'string'}
    },
}