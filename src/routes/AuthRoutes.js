const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const AuthController = require('../controllers/AuthController')

module.exports = app => {
  app.post('/auth', upload.none(), AuthController.status)
  app.post('/auth/login', upload.none(), AuthController.login)
  app.post('/auth/registration', upload.none(), AuthController.registration)

  return app
}