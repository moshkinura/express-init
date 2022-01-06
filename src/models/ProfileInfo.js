const { Sequelize, DataTypes, Model } = require('sequelize')

const { db } = require('../config/db')

const ProfileInfo = db.define('ProfileInfo', {
  hair: {
    type: DataTypes.ENUM([
      'Black',
      'Blond',
      'Brown',
      'Fair',
      'Ginger',
      'Other',
    ]),
  },
  age: {
    type: DataTypes.SMALLINT,
  },
  ethnicity: {
    type: DataTypes.ENUM([
      'Chinese',
      'Danish',
      'Dutch',
      'English',
      'Finnish',
      'French',
      'German',
      'Greek',
      'Hungarian',
      'Italian',
      'Japanese',
      'Norwegian',
      'Portuguese',
      'Rumanian',
      'Russia',
      'Spanish',
      'Swedish',
      'Welsh',
      'Other',
    ]),
  },
}, {
  timestamp: false,
  tableName: 'ProfileInfo',
})

module.exports = ProfileInfo