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
   await queryInterface.bulkInsert('Authors', [
    {
      name: 'Tere Liye',
      email: 'tereliye@gmail.com',
      age: 43,
      gender: 'Male',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Andrea Hirata',
      email: 'hirataandrea@gmail.com',
      age: 55,
      gender: 'Male',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Pidi Baiq',
      email: 'pidibaiq@gmail.com',
      age: 50,
      gender: 'Male',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Dee Lestari',
      email: 'deelestari@gmail.com',
      age: 47,
      gender: 'Female',
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
