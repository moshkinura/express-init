const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Price = db.define('Price', {
  currency: {
    type: DataTypes.ENUM([
      'pound',
      'euro',
      'dollar',
    ]),
    defaultValue: 'pound',
    allowNull: false,
  },
  incall15min: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  incall30min: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  incall1hour: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  incallnight: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  outcall15min: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  outcall30min: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  outcall1hour: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  outcallnight: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamp: false,
  tableName: 'Price',
})

module.exports = Price