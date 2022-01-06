const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Service = db.define('Service', {
  name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
  },
}, {
  timestamp: false,
  tableName: 'Service',
})

module.exports = Service