const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Token = db.define('Token', {
  refresh: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamp: true,
  tableName: 'Token',
})

module.exports = Token