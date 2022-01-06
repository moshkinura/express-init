const jwt = require('jsonwebtoken')

const JWT_ACCESS_KEY = 'd64dc563ce4833271a76ae267ae0de78'
const JWT_REFRESH_KEY = '3d1b472a19f46c9abbdc6cd99dd46315'

module.exports = () => {
  const getAccess = (payload) => {
    try {
      return jwt.sign(payload, JWT_ACCESS_KEY)
    } catch (e) {
      console.error(`#JWT:getAccess: ${e.message}`)
      return false
    }
  }

  const getRefresh = (payload) => {
    try {
      return jwt.sign(payload, JWT_REFRESH_KEY)
    } catch (e) {
      console.error(`#JWT:getRefresh: ${e.message}`)
      return false
    }
  }

  const getTokens = (payload) => {
    return {
      token: {
        access: getAccess(payload),
        refresh: getRefresh(payload),
      }
    }
  }

  const verifyAccess = (payload, complete = false) => {
    try {
      return jwt.verify(payload, JWT_ACCESS_KEY, {complete})
    } catch (e) {
      console.error(` #JWT:verifyAccess: ${e.message}`)
      return false
    }
  }

  const verifyRefresh = (payload, complete = false) => {
    try {
      return jwt.verify(payload, JWT_REFRESH_KEY, {complete})
    } catch (e) {
      console.error(` #JWT:verifyRefresh: ${e.message}`)
      return false
    }
  }

  const getAccessKey = () => {
    return JWT_ACCESS_KEY
  }

  const getRefreshKey = () => {
    return JWT_ACCESS_KEY
  }

  return {
    getAccess,
    getRefresh,
    getTokens,
    verifyAccess,
    verifyRefresh,
    getAccessKey,
    getRefreshKey,
    jwt,
  }
}