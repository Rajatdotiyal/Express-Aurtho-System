var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localstrategy=require('passport-local');
passport.use(new localstrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/profile', isLoggedIn,function(req, res, next) {
  res.render('profile');
});



router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/register', function(req, res, next) {
  var userdata= new userModel({
    username: req.body.username,
    email:req.body.email,
    fullname:req.body.fullname
  });
  
  userModel.register(userdata, req.body.password).then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })

});

router.post('/login',passport.authenticate('local',{
  successRedirect:'profile',
  failureRedirect:'/'
}), function(req,res){ });

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/login')
  });
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}



module.exports = router;
