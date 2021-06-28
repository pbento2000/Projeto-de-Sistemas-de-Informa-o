var Photo = require('../models/photo');
var async = require('async');
var User = require('../models/user');


exports.post_photo = function(req, res, next) {
    details = {
        photo: req.body.photo,
        name: req.body.name,
        owner: req.body.owner,
        likes: 0
    }

    if (req.body.description.length != 0) {
        details["description"] = req.body.description;
    }

    var photo = new Photo(details);

    photo.save(function (err) {
        if (err){
            err.status = 409;
            return next(err);
        } 
        return res.json(photo);
    });
};

exports.getPhotoById = function(req, res, next){
    Photo.findById(req.params.id).exec(function (err, r) {if (err) throw err; res.send(r);});
};

exports.deletePhoto = function(req, res, next){
    let photo;
    Photo.findById(req.params.id).exec(function (err, r) {
        if (err) throw err; 
        photo = r;
        User.updateMany({favorite_pics: {$in: [req.params.id]}}, {$pull: { favorite_pics: req.params.id}}, function(err, result){
            if (err) { return next(err); };
        });
        User.updateMany({liked_pics: {$in: [req.params.id]}}, {$pull: { liked_pics: req.params.id}}, function(err, result){
            if (err) { return next(err); };
        });
    });

    Photo.findByIdAndDelete(req.params.id, function (err) {
        if (err) return next(err);
        res.json();
    }); 
};

exports.hasPhotos = function(req, res, next){
    Photo.exists({ owner: req.params.id}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
};

exports.add_like = function(req, res, next){
    Photo.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 }}, function(err, result){
        if (err) { return next(err); };
        res.json();
        User.findByIdAndUpdate(req.body.userid, {$push: {liked_pics: [result]}}, function(err, result){
            if (err) { return next(err); };
            res.json();
        });
    });
};

exports.remove_like = function(req, res, next){
    Photo.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 }}, function(err, result){
        if (err) { return next(err); };
        res.json();
        User.findByIdAndUpdate(req.body.userid, {$pull: {liked_pics: result._id}}, function(err, result){
            if (err) { return next(err); };
            res.json();
        });
    });
};

exports.getPopularPhotosIds = function(req, res, next){
    Photo.find({}, {_id: 1}).limit(50).sort({likes: -1})
      .exec(function (err, list_photos) {
        if (err) return next(err);
        res.json(list_photos);
      });
};

exports.getRecentPhotosIds = function(req, res, next){
    Photo.find({}, {_id: 1}).limit(50).sort({_id:-1})
      .exec(function (err, list_photos) {
        if (err) return next(err);
        res.json(list_photos);
      });
};

exports.getProfilePhotosIds = function(req, res, next){
    User.find({username: req.params.username}).exec(function(err, user){
        Photo.find({owner: user}, {_id: 1}).exec(function(err, list_photos){
            if (err) return next(err);
            res.json(list_photos);
        });

    })
};

exports.getSomePhotos = function(req, res, next){
    let ids = JSON.parse(req.params.ids);
    async.mapSeries(ids, function(id, callback){
        Photo.findById(id['_id']).exec(function (err, r) {if (err) throw err; callback(null, r);});
    }, function(err, ps){
        res.json(ps);
    });
}