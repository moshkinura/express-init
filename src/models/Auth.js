const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Auth = db.define('Auth', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailCheck: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  validateCode: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamp: true,
  tableName: 'Auth',
})

module.exports = Auth