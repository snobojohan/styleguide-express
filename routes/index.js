var express = require('express');
var contentHandler = require('../services/index');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About styleguide' });
});


router.param('category', function(req, res, next, category) {

    // TODO: HERE
    contentHandler.getContent()
        .then(
            function(content){
                req.menu = contentHandler.getMenu( content, category);

                req.category = contentHandler.getPost( content, category );

                next();
            }
        )
        .catch(function (err) {
            console.log("ERROR: ",err)
            next()
        })

});

router.get('/:category', function(req, res) {
    res.render('category', { globalMenu: req.menu, categoryName: req.category });
});

router.param('post', function(req, res, next, post) {

  contentHandler.getContent()
    .then(
      function(content){
        req.menu = contentHandler.getMenu( content, post);

        req.post = contentHandler.getPost( content, post );

        next();
      }
    )
    .catch(function (err) {
      console.log("ERROR: ",err)
      next()
    })

});

router.get('/:category/:post', function(req, res) {
    res.render('post', { globalMenu: req.menu, activePost: req.post.fields });
});

module.exports = router;
