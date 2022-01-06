let Auth = require('./Auth') //
let Token = require('./Token') //
let Profile = require('./Profile') //
let ProfileInfo = require('./ProfileInfo') //
let Service = require('./Service') //
let Price = require('./Price') //
let Location = require('./Location') //
let Image = require('./Image') //

Auth.hasMany(Token)
Token.belongsTo(Auth)

Auth.hasOne(Profile)
Profile.belongsTo(Auth)

Auth.hasOne(ProfileInfo)
ProfileInfo.belongsTo(Auth)

Auth.hasMany(Service)
Service.belongsTo(Auth)

Auth.hasOne(Price)
Price.belongsTo(Auth)

Auth.hasOne(Location)
Location.belongsTo(Auth)

Auth.hasMany(Image)
Image.belongsTo(Auth)

module.exports = {
  Auth,
  Token,
  ProfileInfo,
  Service,
  Location,
  Price,
  Profile,
  Image,
}