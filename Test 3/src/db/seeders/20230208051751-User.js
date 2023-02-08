'use strict';
const roles = require('../../utils/user_role');
const bcrypt = require('bcrypt');

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
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Sekar Madu K',
        email: 'sekarmadu99@gmail.com',
        password: await bcrypt.hash('secret123', 10),
        role: roles.admin,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Azar Nuzy',
        email: 'azarnuzy@gmail.com',
        password: await bcrypt.hash('secret456', 10),
        role: roles.user,
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
    await queryInterface.bulkDelete('Users', null, {});
  }
};
