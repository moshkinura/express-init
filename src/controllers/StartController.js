const mongoose = require('mongoose')

const Model = require('../models')

module.exports = {
  // [ALL] /
  async ping(req, res, next) {
    try {
      const { body, headers, query } = req
      console.log(body, query, headers)

      Model.Start.create({ type: true })

      return res.json({ success: true })
    } catch (e) {
      let ERROR = new Error(e)
      ERROR = {
        statusCode: e.statusCode || 500,
        message: e.message || e,
      }
      next(ERROR)
      return false
    }
  },
}