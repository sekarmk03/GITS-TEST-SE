'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.Author, {through: 'Book_Author'});
      Book.belongsTo(models.Publisher, {foreignKey: 'pub_id', as: 'publisher'});
    }
  }
  Book.init({
    isbn: DataTypes.STRING,
    title: DataTypes.STRING,
    pub_year: DataTypes.INTEGER,
    pub_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};