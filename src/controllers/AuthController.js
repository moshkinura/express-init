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
  // [POST] /auth/registration
  async registration(req, res, next) {
    try {
      const { email, nickname, password, repeatPassword } = req.body

      if (!(validator.isEmail(email))) { //email
        throw { statusCode: 400, message: 'No valid Email' }
      }

      if (!(password === repeatPassword)) {
        throw { statusCode: 400, message: "Passwords don't match" }
      }

      const selectAuth = await Model.Auth.findOne({
        where: {
          email,
        }
      })

      if (!(selectAuth === null)) { //email undefined
        throw { statusCode: 400, message: 'The email is already registered' }
      }

      if (!(validator.isStrongPassword(password, { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 }))) { //password
        throw { statusCode: 400, message: 'Password min length 8' }
      }

      const hashPassword = passwordHash.generate(password)
      const dateNow = Math.round(Date.now() / 1000)
      const hashValidate = passwordHash.generate(`${email}+STRIPRADAR+${dateNow}`)

      const insAuth = await Model.Auth.create({
        email,
        password: hashPassword,
        emailCheck: false,
        validateCode: hashValidate,
      })

      if (!insAuth.id) {
        throw { statusCode: 500, message: 'DataBase Error. Try again, if the error persists, contact technical support.' }
      }

      let insProfile = await insAuth.createProfile({
        active: false,
        nickname,
      })

      if (!insProfile.id) {
        throw { statusCode: 500, message: 'DataBase Error. Try again, if the error persists, contact technical support.' }
      }

      let transporter = nodemailer.createTransport(email_transport)

      let href = `http://localhost:3000/auth/check-email?email=${email}&hash=${hashValidate}`

      let result = await transporter.sendMail({
        from: `"BOT StripRadar" <${email_transport.auth.user}>`, // Откого
        to: `${email}`, // Кому
        subject: `Email confirmation`, // Тема
        text: `Please follow the link and confirm your email address: ${href}`,
        html: `
          <h3>StripRadar</h3><br>
          <h4>Please follow the link and confirm your email address: <a href="${href}">Check Email</a></h4>
        `,
      })

      if (!result.accepted) {
        throw { statusCode: 500, message: 'The confirmation was not sent to the email. Contact technical support.' }
      }

      let payload = {
        id: insAuth.id,
        email,
      }

      let expiresAccess = 3600 // время жизни access token (сек)
      let expiresRefresh = 2678400 // время жизни refresh token (сек)

      const expAccess = dateNow + expiresAccess
      const expRefresh = dateNow + expiresRefresh

      const accessToken = JWT.getAccess({
        ...payload,
        exp: expAccess,
      })

      const refreshToken = JWT.getRefresh({
        ...payload,
        exp: expRefresh,
      })

      let insToken = await insAuth.createToken({
        refresh: refreshToken,
        expiresIn: new Date(expRefresh * 1000).toISOString(),
      })

      if (!insToken.id) {
        throw { statusCode: 500, message: 'DataBase Error. Try again, if the error persists, contact technical support.' }
      }

      return res.json({
        success: true,
        user: {
          id: payload.id,
          email: payload.email,
        },
        token: {
          method: 'bearer',
          access: accessToken,
          refresh: refreshToken,
        },
      })
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

  // [POST] /auth/login
  async login(req, res, next) {
    try {
      const { email, password, remember } = req.body

      const dateNow = Math.round(Date.now() / 1000)

      if (!(email && password)) {
        throw { statusCode: 400, message: 'Data not available' }
      }

      if (!(validator.isEmail(email))) { //email
        throw { statusCode: 400, message: 'No valid Email' }
      }

      if (!(validator.isStrongPassword(password, { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 }))) { //password
        throw { statusCode: 400, message: 'Password min length 8' }
      }

      const selectAuth = await Model.Auth.findOne({
        where: {
          email,
        }
      })

      if (selectAuth === null) { //email undefined
        throw { statusCode: 400, message: 'Not registered account' }
      }

      if (!passwordHash.verify(password, selectAuth.password)) {
        throw { statusCode: 400, message: "Passwords don't match" }
      }

      let payload = {
        id: selectAuth.id,
        email,
      }

      let expiresAccess = 3600 // время жизни access token (сек)
      let expiresRefresh = 2678400 // время жизни refresh token (сек)
      if (remember === 'on') {
        expiresAccess = 86400 // время жизни, если запомнить (сек)
      }
      const expAccess = dateNow + expiresAccess
      const expRefresh = dateNow + expiresRefresh

      const accessToken = JWT.getAccess({
        ...payload,
        exp: expAccess,
      })

      const refreshToken = JWT.getRefresh({
        ...payload,
        exp: expRefresh,
      })

      let insToken = await selectAuth.createToken({
        refresh: refreshToken,
        expiresIn: new Date(expRefresh * 1000).toISOString(),
      })

      if (!insToken.id) {
        throw { statusCode: 500, message: 'DataBase Error. Try again, if the error persists, contact technical support.' }
      }

      return res.json({
        success: true,
        user: {
          id: payload.id,
          email: payload.email,
        },
        token: {
          method: 'bearer',
          access: accessToken,
          refresh: refreshToken,
        },
      })
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


  // [POST] /auth
  async status(req, res, next) {
    try {
      const { ok } = req.body

      if (ok) {
        return res.json({
          success: true,
          data: [],
        })
      } else {
        throw { statusCode: 418, message: 'I am a teapot :)' }
      }
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