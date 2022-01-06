const express = require('express')

module.exports = ExpressConfig = async (App) => {
  const app = express()
  // прикручиваем к нему модуль для обработки post запросов
  app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
  app.use(express.json({ limit: '100mb', type: 'application/*' })) // to support JSON

  // сразу же после того как прикрутили модуль, отлавливаем ошибки
  // если коиент передал битый json, то модуль который идет выше, выкинит Exeption,
  // мы его тут же отлавливаем, и говорим клиенту, что он передал что то битое.
  app.use(async (error, req, res, next) => {
    if (error) {
      await App.logger.error(` #main: [0]: [broken-json] ${error.message}`)
      return res.json({ success: false, message: 'broken-json' })
    }
    next()
  })

  // вот простой пример того, как можно разрешить делать CORS запросы, и получить базовую 
  // информаци об клиенте который делает запрос ...
  app.use(async (req, res, next) => {
    try {
      // CORS Headers
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, accept, authorization, x-access-token')
      res.header('Access-Control-Expose-Headers', 'Authorization')
      res.header('access-control-allow-methods', 'GET,PUT,POST,HEAD,DELETE,OPTIONS')
      res.header('Access-Control-Allow-Credentials', false)
      res.header('Access-Control-Max-Age', '86400')
      res.header('X-Powered-By', 'StripRadar')

      // Собираем данные о коннекте
      const path = ('' + req.path)
      const method = ('' + req.method).trim()

      await App.logger.info(`[${path}][${method}]`)

      // это обязательно => 
      return next()
    } catch (e) {
      // но лучше выкдывать ошибку вот так, что бы она была в рамках всего API.
      await App.logger.error(` #main: [1]: [server-error] ${e}`)
      res.json({ success: false, message: 'server-error', data: e })
    }
  })

  // передаем созданный app, назад в родителя
  return app
}