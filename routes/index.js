var express = require('express');
var contentHandler = require('../services/index');
var router = express.Router();
var fs = require('fs');
var path    = require('path');

/* GET home page. */
router.param('/', function(req, res, next) {

    // TODO: HERE
    contentHandler.getContent()
        .then(
            function(content){

                req.menu = contentHandler.getMenu(content);
                next();
            }
        )
        .catch(function (err) {
            console.log("ERROR: ",err)
            next()
        })

});

router.get('/', function(req, res, next) {
  res.render('index', { globalMenu: req.menu });
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

function parseBodyObject(body) {
  /* If the recursive function finds an html-block it expects to parse a regular
     text-block and an html-block. */
  function recParser(rest, bodyList) {



    if (!rest || !rest.length) {
      return bodyList;
    }

    var parsedChars = 0;
    var splitted = rest.split('<html-include>', 2);

    bodyList.push({
      content: splitted[0]
    });

    if (!rest.includes('<html-include>') || !rest.includes('</html-include>')) {
      return bodyList;
    }

    parsedChars += splitted[0].length;
    splitted.shift();

    var fileName = splitted.join('').split('</html-include>')[0];
    var file = global.appRoot + "/content/" + splitted.join('').split('</html-include>')[0];
    var htmlContent = "";
    try {
      htmlContent = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.log("ERROR: ",err)
    }

    if(htmlContent){
      bodyList.push({
        content: htmlContent,
        isHtml: true
      });
    }

    parsedChars += '<html-include></html-include>'.length + fileName.length;

    return recParser(rest.slice(parsedChars), bodyList);
  }

  if (!body || !body.includes('<html-include>')) {
    return [{ content: body, type: 'text' }];
  }

  return recParser(body, []);
}

router.param('post', function(req, res, next, post) {

  contentHandler.getContent()
    .then(
      function(content){

        req.menu = contentHandler.getMenu( content, post);

        req.post = contentHandler.getPost( content, post );
        /*
          bodyList: parsed list of objects found in body, based on the tag <html-block>.
          object: { content: '', isHtml: true or false }
        */
        if (req.post && req.post.fields) {
          req.post.fields.bodyList = parseBodyObject(req.post.fields.body);
        }
        next();
      }
    )
    .catch(function (err) {
      console.log("ERROR: ",err)
      next()
    })

});

router.get('/:category/:post', function(req, res) {
    if (req.post && req.menu) {
      res.render('post', { globalMenu: req.menu, activePost: req.post.fields });
    }
});

module.exports = router;
