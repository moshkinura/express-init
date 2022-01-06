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

    files.forEach((file) => {
      core.logger.info('[CORE] require ./routes/'+file)
      require('./'+file)(core)
    })

    return core
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