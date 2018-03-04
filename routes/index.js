var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/about', function(req, res, next) {
  res.render('about', {});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {});
});

router.get('/project', function(req, res, next){
  res.render('project',{});
});

router.get('/project/detail', function(req, res, next){
  $.ajax({
    url: "/api/project/getProjectDetailById",
    method: "POST",
    dataType: "json",
    data: {
      projectId: req.query.id
    },
    success: function (data) {
      res.render('projectDetail',data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error");
    }
  });
});

router.get('/project/new', function(req, res, next){
  res.render('projectCreate',{});
});

router.get('/profile', function(req, res){
  if(req.session.uid == null){
    res.redirect('/login');
    return;
  }
  res.render('profile');
});

router.get('/admin', function(req, res){
  if(req.session.uid!=1){
    res.redirect('/');
    return;
  }
  res.render('admin');
});

router.get('/upload-complete', function(req, res){
  if(req.session.uid == null){
    res.redirect('/login');
    return;
  }
  res.render('upload-complete');
});



router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {});
});

router.get('/logout', function(req, res, next) {
  req.session.uid=null;
  res.redirect('/');
});

router.get('/proposal', function(req, res){
  res.render('proposal');
});

module.exports = router;
