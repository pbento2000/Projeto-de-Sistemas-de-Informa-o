var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    photo: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String},
    likes: {type: Number},
    //owner: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

// Virtual for photo's URL
PhotoSchema
.virtual('url')
.get(function () {
  return '/photo/' + this._id;
});

//Export function to create "Photo" model class
module.exports = mongoose.model('Photo', PhotoSchema);