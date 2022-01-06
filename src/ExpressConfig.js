require('dotenv').config()

const express = require('express')

module.exports = ExpressConfig = async (App) => {
  const app = express()

  app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
  app.use(express.json({ limit: '100mb', type: 'application/*' })) // to support JSON

  app.use(async (error, req, res, next) => {
    if (error) {
      await App.logger.error(` #main: [0]: [broken-json] ${error.message}`)
      return res.json({ success: false, message: 'broken-json' })
    }
    next()
  })

  app.use(async (req, res, next) => {
    try {
      // CORS Headers
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, accept, authorization, x-access-token')
      res.header('Access-Control-Expose-Headers', 'Authorization')
      res.header('access-control-allow-methods', 'GET,PUT,POST,HEAD,DELETE,OPTIONS')
      res.header('Access-Control-Allow-Credentials', false)
      res.header('Access-Control-Max-Age', '86400')
      res.header('X-Powered-By', process.env.APP_NAME || 'backend')

      // Data connect
      const path = ('' + req.path)
      const method = ('' + req.method).trim()

      await App.logger.info(`[${path}][${method}]`)

      return next()
    } catch (e) {
      let ERROR = new Error(e)
      ERROR = {
        statusCode: e.statusCode || 500,
        message: e.message || e,
      }
      next(ERROR)
      return false
    }
  })

  return app
}