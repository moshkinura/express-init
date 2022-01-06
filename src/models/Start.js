const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Start = db.define('Start', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
}, {
  timestamp: true,
  tableName: 'Start',
})

module.exports = Start