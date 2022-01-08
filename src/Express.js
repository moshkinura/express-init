require('dotenv').config()

const express = require('express')
const ExpressConfig = require('./ExpressConfig')

const { Logger } = require('camel-logger')
const logger = new Logger('log/backend_log.txt')
const db = require('./config/db')

const Routes = require('./routes')
const Controllers = require('./controllers')

const APP_PORT = process.env.APP_PORT || 4000

module.exports = class ExpressJS {
  constructor() {
    this.app = null
    this.logger = null
    this.controllers = null
    this.models = null

    this.init()
  }

  async init() {
    this.app = express()
    this.logger = logger
    this.controllers = Controllers(this)

    /* APP */
    await db(this) // connect with db

    this.app = await ExpressConfig(this)

    this.app.api = express.Router()

    this.app.use('/', this.app.api)

    // ALL AUTO ROUTES
    Routes(this)

    /* /APP */

    /* ERROR TRAP */
    this.app.use('*', async (err, req, res, next) => {
      if (err.statusCode) {
        const MessageError = {
          success: false,
          error_code: err.statusCode,
          message: err.message
        }
        await this.logger.error(`#ERR [${err.statusCode}]: ${JSON.stringify(MessageError)}`)
        return res.status(err.statusCode).json(MessageError)
      } else {
        console.error(err)
      }
    })

    this.app.listen(APP_PORT, () => {
      this.logger.info(`#BACKEND started on port ${APP_PORT}`)
    })
  }
}