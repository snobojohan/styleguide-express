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

router.param('post', function(req, res, next, post) {

  contentHandler.getContent()
    .then(
      function(contentAndMenu){
        req.menu = contentHandler.getMenu( contentAndMenu, post);
        req.post = contentHandler.getPost( contentAndMenu );
        next();
      }
    )
    .catch(function (err) {
      console.log("ERROR: ",err)
      next()
    })


});

router.get('/:category/:post', function(req, res) {
    res.render('post', { menu: req.menu, item: req });
});

/*
router.param('category', function(req, res, next, category) {

    console.log('Category : ' + category);

    categories.getCategory(category).then(

      function (categoriesCollection) {
        // console.log('categoriesCollection : ', categoriesCollection, "items", categoriesCollection.items);
        req.menu = "bar";
        req.category = categoriesCollection.items[0];
        next();
      }).catch(function (err) {
        console.log("ERROR: ",err)
        next()
      })
});
// route with parameters (http://localhost:8080/hello/:name)
router.get('/:category', function(req, res) {
    res.render('category', { menu: req.menu, item: req.category.fields });
});

*/

module.exports = router;
