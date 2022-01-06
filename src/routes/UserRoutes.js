const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const UserController = require('../controllers/UserController')

module.exports = app => {
  app.post('/user', upload.none(), UserController.getUser)
  app.post('/user-edit', upload.none(), UserController.editUser)
  //app.get('/userId', upload.none(), UserController.getUserId)
  //app.post('/auth/login', upload.none(), AuthController.login)
  //app.post('/auth/registration', upload.none(), AuthController.registration)

  return app
}