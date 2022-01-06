require('dotenv').config()

const { Sequelize, DataTypes, Model } = require('sequelize')

const username = process.env.DB_USERNAME || 'postgres'
const password = process.env.DB_PASSWORD || 'qwerty'
const host = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 5432
const database = process.env.DB_NAME || 'postgres'

const sequelize = new Sequelize({
  database,
  username,
  password,
  host,
  port,
  dialect: "postgres"
})

sequelize.sync()

module.exports = {
  db: sequelize,
}