const fs = require('fs-extra')
const path = require('path')

module.exports = (core) => {
  try {
    let files = fs.readdirSync(__dirname, (err, files) => {
      if (err) {
        throw { statusCode: 500, message: 'READDIR_SYNC 500 error' }
      }
      return files
    })

    const indexFile = path.basename(__filename)

    files = files.filter((item) => {
      return item !== indexFile
    })

    let all = {}

    files.forEach((file) => {
      const ext = path.extname(file)
      const filename = path.basename(file, ext)
      core.logger.info('[CORE] require ./controllers/'+file)
      all[filename] = require('./'+file)
    })

    return all
  } catch (e) {
    let ERROR = new Error(e)
    ERROR = {
      statusCode: e.statusCode || 500,
      message: e.message || e,
      data: e,
    }
    console.log(ERROR)
    return false
  }
}