var client = require('./contentfulClient').client

function getContent () {
  query = {}
  query['content_type'] = 'category'
  return client.getEntries(query)
}



function getMenu(entries, postSlug){

    entries = entries || {};
    postSlug = postSlug || '';

  var tempParent;

  function activePost(item) {
        return item.fields.slug === postSlug;
    }

  function makeSubMenu(item){
    var sm = {};
    sm['title'] = item.fields.title
    sm['slug'] = item.fields.slug
    sm['active'] = item.fields.slug === postSlug ? true : false
    sm['parentSlug'] = tempParent;
    return sm;
  }

  function makeMenu(item) {
    var mm = {};
    mm['title'] = item.fields.categoryName
    mm['slug'] = item.fields.slug

      tempParent = item.fields.slug

    mm['active'] = (item.fields.postsInCategory.find(activePost) !== undefined) ? true : false
    mm['children'] = item.fields.postsInCategory.map(makeSubMenu)

    return mm;
  }

  return entries.items.map(makeMenu);

}

function getPost(entries, postSlug){

    var ret;

    function activePost(item) {


        return item.fields.slug === postSlug;
    }

    entries.items.forEach(function(item) {

        var test = item.fields.postsInCategory.find(activePost);

        if(test !== undefined){
            ret = test;
        }
    });

    return ret;
}

module.exports = {
  getContent,
  getMenu,
  getPost
}
