var secrets = require('../config/secrets');
var Chef = require('../models/chef');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
var ctrlAuth = require('./auth');
module.exports = function(router) {

  var chefidRoute = router.route('/chefs/:id');
  
  chefidRoute.get(auth, function(req, res) {
    if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile", "data" : ""
    });
  } else {
    var id = req.params.id;
    
  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}
  	Chef.findById(id, function(err, chef){
  	 	if(chef)
  	 		res.json({"message" : "got chef", "data": chef});
  	 	else
  	 		res.status(404).json({"message" : "chef not in database", "data": chef});
  	});
  }
  });

  chefidRoute.put(function(req, res){
  	var id = req.params.id;
  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}

    var options = {};
    options.new = true;
  	Chef.findByIdAndUpdate(id,{$set:req.body}, options, function(err, chef){
  	 	if(chef)
  	 		res.json({"message" : "updated chef information", "data": chef});
  	 	else
  	 		res.status(404).json({"message" : "chef was not in database", "data": chef});
    });

  });

  chefidRoute.delete(function(req, res){
	var id = req.params.id;
  	if(!mongoose.Types.ObjectId.isValid(id))
  	{
  		res.status(404).json({"message" : "not a valid mongoose id", "data" : ""});
  		return;
  	}
  	Chef.findByIdAndRemove(id, function(err, chef){
  	 	if(chef)
  	 		res.json({"message" : "deleted chef", "data": chef});
  	 	else
  	 		res.status(404).json({"message" : "chef was not in database", "data": chef});
  	});
  });

  return router;
}