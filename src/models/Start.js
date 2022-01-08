const mongoose = require('mongoose')
const { Schema } = mongoose

const StartSchema = new Schema({
  type: {
    type: Boolean,
    required: true,
  },
})

module.exports = mongoose.model('Start', StartSchema)