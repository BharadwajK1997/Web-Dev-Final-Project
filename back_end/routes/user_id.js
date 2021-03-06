var secrets = require('../config/secrets');
var User = require('../models/user');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
var ctrlAuth = require('./auth');

module.exports = function(router) {

  var useridRoute = router.route('/users/:id');
  
  useridRoute.get(auth, function(req, res) {
    if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile", "data":""
    });
  } else {
    var id = req.params.id;

  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}
  	User.findById(id, function(err, user){
  	 	if(user)
  	 		res.json({"message" : "got user", "data": user});
  	 	else
  	 		res.status(404).json({"message" : "user not in database", "data": user});
  	});
  }
  });

  useridRoute.put(function(req, res){
  	var id = req.params.id;
  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}

    var options = {};
    options.new = true;
  	User.findByIdAndUpdate(id,{$set:req.body}, options, function(err, user){
  	 	if(user)
  	 		res.json({"message" : "updated user information", "data": user});
  	 	else
  	 		res.status(404).json({"message" : "user was not in database", "data": user});
    });

  });

  useridRoute.delete(function(req, res){
	var id = req.params.id;
  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}
  	User.findByIdAndRemove(id, function(err, user){
  	 	if(user)
  	 		res.json({"message" : "deleted user", "data": user});
  	 	else
  	 		res.status(404).json({"message" : "user was not in database", "data": user});
  	});
  });

  return router;
}