'use strict';
const {
  Model
} = require('sequelize');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    async checkPassword(password) {
      return await bcrypt.compareSync(password, this.password);
    }

    generateToken() {
      const payload = {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role
      };

      return jwt.sign(payload, JWT_SECRET_KEY);
    }

    static authenticate = async ({email, password}) => {
      try {
        const user = await this.findOne({where: {email: email}});
        if(!user) return Promise.reject(new Error('User Not Found'));

        const valid = await user.checkPassword(password);
        if(!valid) return Promise.reject(new Error('Wrong Password'));

        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};