module.exports = {
    createBook: {
        isbn: 'string',
        title: 'string',
        pub_year: 'number',
        pub_id: 'number'
    },
    updateBook: {
        isbn: {optional: true, type: 'string'},
        title: {optional: true, type: 'string'},
        pub_year: {optional: true, type: 'number'},
        pub_id: {optional:true, type: 'number'}
    },
}