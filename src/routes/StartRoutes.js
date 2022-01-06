const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = core => {
  core.app.get('/', upload.none(), core.controllers.StartController.ping)
  core.app.post('/', upload.none(), core.controllers.StartController.ping)
  core.app.put('/', upload.none(), core.controllers.StartController.ping)
  core.app.patch('/', upload.none(), core.controllers.StartController.ping)
  core.app.delete('/', upload.none(), core.controllers.StartController.ping)
  core.app.options('/', upload.none(), core.controllers.StartController.ping)

  return core
}