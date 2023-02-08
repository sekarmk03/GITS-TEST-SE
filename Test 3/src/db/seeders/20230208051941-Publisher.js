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
   await queryInterface.bulkInsert('Publishers', [
    {
      name: 'Gramedia Pustaka Utama',
      email: 'redaksi@gramediapustakautama.id',
      city: 'Jakarta',
      zip_code: '10270',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mahaka Publishing',
      email: 'publishing@mahaka.com',
      city: 'Jakarta',
      zip_code: '10120',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bentang Pustaka',
      email: 'promosi@bentangpustaka.com',
      city: 'Yogyakarta',
      zip_code: '55584',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mizan Digital Publishing',
      email: 'cs@mizan.com',
      city: 'Jakarta',
      zip_code: '12610',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Penerbit Erlangga',
      email: 'penerbit@erlangga.com',
      city: 'Jakarta',
      zip_code: '13740',
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
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
