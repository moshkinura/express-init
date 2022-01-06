const express = require('express')
const ExpressConfig = require('./ExpressConfig')

const { Logger } = require('camel-logger')
const logger = new Logger('log/api_log.txt')

// const Routes = require('./routes')

const AuthRoutes = require('./routes/AuthRoutes')
const UserRoutes = require('./routes/UserRoutes')

const portApp = process.env.APP_PORT || 4000

module.exports = ExpressJS = class ExpressJS {
  constructor() {
    this.app = null
    this.logger = null

    this.init()
  }

  async init() {
    // const app = express()
    this.app = express()
    this.logger = logger

    /* APP */
    this.app = await ExpressConfig(this)

    this.app.api = express.Router()

    this.app.use('/', this.app.api)

    // Routes(this.app)

    // ROUTES
    AuthRoutes(this.app)
    UserRoutes(this.app)
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

    this.app.listen(portApp, () => {
      this.logger.info(`#API STRIPRADAR started on port ${portApp}`)
    })
  }
}