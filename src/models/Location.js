const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Location = db.define('Location', {
  lng: {
    type: DataTypes.DECIMAL(10, 7),
  },
  lat: {
    type: DataTypes.DECIMAL(10, 7),
  },
}, {
  timestamp: false,
  tableName: 'Location',
})

module.exports = Location