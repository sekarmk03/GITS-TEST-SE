'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Books', [
    {
      isbn: "978-602-03-2478-4",
      title: "Hujan",
      author_id: 1,
      pub_year: 2016,
      pub_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      isbn: "978-602-9474-03-9",
      title: "Berjuta Rasanya",
      author_id: 1,
      pub_year: 2012,
      pub_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      isbn: "979-3062-92-4",
      title: "Sang Pemimpi",
      author_id: 2,
      pub_year: 2006,
      pub_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      isbn: "978-602-7870-41-3",
      title: "Dilan 1",
      author_id: 3,
      pub_year: 2014,
      pub_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      isbn: "978-979-1227-78-0",
      title: "Perahu Kertas",
      author_id: 4,
      pub_year: 2014,
      pub_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Books', null, {});
  }
};
