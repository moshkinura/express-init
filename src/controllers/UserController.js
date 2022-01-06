const validator = require('validator')
const passwordHash = require('password-hash')
const passport = require('../passport')
const JWT = passport()

const nodemailer = require('nodemailer')

const Model = require('../models')

let environment = process.env.NODE_ENV
let isDevelopment = environment === 'development'
let email_transport = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}
if (isDevelopment) {
  email_transport = {
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'bot@stripradar.com',
      pass: 'stripradar2021'
    }
  }
}

module.exports = {
  // [POST] /user
  async getUser(req, res, next) {
    try {
      const getTokenFromHeader = (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'bearer') {
          return req.headers.authorization.split(' ')[1]
        }
      }

      const token = getTokenFromHeader(req)
      const dateNow = Math.round(Date.now() / 1000)
      const validToken = JWT.verifyAccess(token, false)

      console.log(token, validToken)

      if (!validToken) {
        throw { statusCode: 401, message: 'The token failed validation.' }
      }

      if (validToken.exp < dateNow) {
        throw { statusCode: 401, message: 'The token expired.' }
      }

      const idUser = validToken.id
      const emailUser = validToken.email

      const selectUser = await Model.Auth.findOne({
        where: {
          id: idUser,
          email: emailUser,
        },
        attributes: {
          exclude: ['password'],
        },
        include: [
          { model: Model.Profile },
          { model: Model.ProfileInfo },
          { model: Model.Service },
          { model: Model.Price },
          { model: Model.Location },
          { model: Model.Image },
        ]
      })
      console.log(JSON.stringify(selectUser, null, ' '))

      return res.json({ success: true, data: selectUser })
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

  // [POST] /user-edit
  async editUser(req, res, next) {
    try {
      const getTokenFromHeader = (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'bearer') {
          return req.headers.authorization.split(' ')[1]
        }
      }

      const token = getTokenFromHeader(req)
      const dateNow = Math.round(Date.now() / 1000)
      const validToken = JWT.verifyAccess(token, false)

      console.log(token, validToken)

      if (!validToken) {
        throw { statusCode: 401, message: 'The token failed validation.' }
      }

      if (validToken.exp < dateNow) {
        throw { statusCode: 401, message: 'The token expired.' }
      }

      const idUser = validToken.id
      const emailUser = validToken.email

      const { body } = req

      const selectUser = await Model.Auth.findOne({
        where: {
          id: idUser,
          email: emailUser,
        },
        attributes: {
          exclude: ['password'],
        },
        include: [
          { model: Model.Profile },
          { model: Model.ProfileInfo },
          { model: Model.Service },
          { model: Model.Price },
          { model: Model.Location },
          { model: Model.Image },
        ]
      })
      // console.log(JSON.stringify(selectUser, null, ' '))

      console.log(body)
      const type = body.name
      const value = body.value

      if (type === 'nickname') {
        if (selectUser.Profile !== null) {
          let update = await Model.Profile.update({
            nickname: value,
          }, {
            where: {
              AuthId: idUser,
            }
          })

          return res.json({ success: true, data: update })
        } else {
          let insert = await selectUser.createProfile({
            active: false,
            nickname: value,
          })

          return res.json({ success: true, data: insert })
        }
      }

      if (type === 'description') {
        if (selectUser.Profile !== null) {
          let update = await Model.Profile.update({
            description: value,
          }, {
            where: {
              AuthId: idUser,
            }
          })

          return res.json({ success: true, data: update })
        } else {
          let insert = await selectUser.createProfile({
            active: false,
            description: value,
          })

          return res.json({ success: true, data: insert })
        }
      }

      if(type === 'hair'){
        if(selectUser.ProfileInfo !== null) {
          let update = await Model.ProfileInfo.update({
            hair: value,
          }, {
            where: {
              AuthId: idUser,
            }
          })

          return res.json({ success: true, data: update })
        }else{
          let insert = await selectUser.createProfileInfo({
            hair: value,
          })

          return res.json({ success: true, data: insert })
        }
      }

      if(type === 'age'){
        if(selectUser.ProfileInfo !== null) {
          let update = await Model.ProfileInfo.update({
            age: value,
          }, {
            where: {
              AuthId: idUser,
            }
          })

          return res.json({ success: true, data: update })
        }else{
          let insert = await selectUser.createProfileInfo({
            age: value,
          })

          return res.json({ success: true, data: insert })
        }
      }

      if(type === 'ethnicity'){
        if(selectUser.ProfileInfo !== null) {
          let update = await Model.ProfileInfo.update({
            ethnicity: value,
          }, {
            where: {
              AuthId: idUser,
            }
          })

          return res.json({ success: true, data: update })
        }else{
          let insert = await selectUser.createProfileInfo({
            ethnicity: value,
          })

          return res.json({ success: true, data: insert })
        }
      }

      throw { statusCode: 400, message: 'Empty value.' }

    } catch (e) {
      let ERROR = new Error(e)
      ERROR = {
        statusCode: e.statusCode || 500,
        message: e.message || e,
      }
      next(ERROR)
      return false
    }
  }

}