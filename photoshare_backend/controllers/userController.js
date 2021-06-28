var User = require('../models/user');
const jwt = require("jsonwebtoken");
const config = require("../auth.config");

//Display list of all users.
exports.users_list = function(req, res, next) {
    User.find({})
      .exec(function (err, list_users) {
        if (err) return next(err);
        res.json(list_users);
      });
};

// Add a new user and return json with his details
exports.register_user = function(req, res, next) {
    details = { 
        username: req.body.username,
        password: req.body.password
    }
    var user = new User(details);

    user.save(function (err) {
        if (err){
            err.status = 409;
            return next(err);
        } 
        return res.json(user);
    });
};

// Logins a user 
exports.login_user = function(req, res, next) {
    User.findOne({
        username: req.body.username
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
    
          if (!user) {
            return res.status(409).send({ message: "User Not found." });
          }
    
          var passwordIsValid = (req.body.password === user.password);
    
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
    
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
    
          res.status(200).send({
            id: user._id,
            username: user.username,
            token: token
          });
        });
};

// Gets an user by the given id
exports.get_user_by_id = function(req, res, next) {
  User.findById(req.params.id)
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(409).send({ message: "User Not found." });
    }

    res.send(user);
  });
};

exports.add_favorite = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, {$push: { favorite_pics: [req.body]}}, function(err, result){
    if (err) { return next(err); };
        res.json();
  });
};

exports.remove_favorite = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, {$pull: { favorite_pics: req.body._id}}, function(err, result){
    if (err) { return next(err); };
        res.json();
  });
};

exports.already_favorited = function(req, res, next) {
  User.exists({_id: req.params.id, favorite_pics: {$in: [req.params.photoid]}}, function(err, result){
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.already_liked = function(req, res, next) {
  User.exists({_id: req.params.id, liked_pics: {$in: [req.params.photoid]}}, function(err, result){
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getFavoritePhotosIds = function(req, res, next) {
  User.findById(req.params.id, {favorite_pics: 1, _id: 0}).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(409).send({ message: "User Not found." });
    }

    res.send(user);
  });
};
