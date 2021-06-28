var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    favorite_pics: [{type: Schema.Types.ObjectId, required: false, ref: 'Photo'}],
    liked_pics: [{type: Schema.Types.ObjectId, required: false}]
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

//Export function to create "User" model class
module.exports = mongoose.model('User', UserSchema);