var client = require('./contentfulClient').client

function getContent () {
  query = {}
  query['content_type'] = 'category'
  return client.getEntries(query)
}

function getMenu(entries, postSlug){

  function activePost(item) {

    return item.fields.slug === postSlug;
  }

  function makeSubMenu(item){
    console.log("=================");
    console.log(item);
    
    var sm = {};
    sm['subTitle'] = item.fields.title
    sm['subSlug'] = item.fields.slug
    sm['active'] = item.fields.slug === postSlug;
    sm['parent'] = item.fields.slug === postSlug;

    return sm;
  }

  function makeMenu(item) {
    var mm = {};
    mm['itemTitle'] = item.fields.categoryName
    mm['itemSlug'] = item.fields.slug
    mm['active'] = (item.fields.postsInCategory.find(activePost) !== undefined) ? true : false;
    mm['children'] = item.fields.postsInCategory.map(makeSubMenu);

    return mm;
  }

  return entries.items.map(makeMenu);
}

function getPost(contentAndMenu){
  return "Bar"
}

module.exports = {
  getContent,
  getMenu,
  getPost
}
