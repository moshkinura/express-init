const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Image = db.define('Image', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamp: false,
})

module.exports = Image