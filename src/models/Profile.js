const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const Profile = db.define('Profile', {
  active: {
    type: DataTypes.BOOLEAN,
  },
  nickname: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  telephone: {
    type: DataTypes.STRING,
  },
  telephone_check: {
    type: DataTypes.BOOLEAN,
  },
}, {
  timestamp: false,
  tableName: 'Profile',
})

module.exports = Profile