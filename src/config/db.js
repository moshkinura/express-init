require('dotenv').config()

const mongoose = require('mongoose')

const username = process.env.DB_USERNAME || 'mongoose'
const password = process.env.DB_PASSWORD || 'mongodb'
const host = process.env.DB_HOST || 'cluster0.uyb5o.mongodb.net'
const port = process.env.DB_PORT || 27017
const database = process.env.DB_NAME || 'myFirstDatabase'

const URL = `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`

module.exports = async (core) => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    core.logger.log(`[CORE] DB connect - ${database}`)

    return core
  } catch (error) {
    console.log(error)
  }
}