var client = require('./contentfulClient').client

function getCategory (categorySlug) {

  var catQ = {}
  catQ.content_type = 'category';
  client.getEntries(catQ)
    .then(function (entries) {
      // log the file url of any linked assets on field `image`
      entries.items.forEach(function (entry) {
        if(entry.fields.categoryName) {
          console.log("######", entry.fields.categoryName );
          if( entry.fields.linkedPostInCategory.length ) {
            entry.fields.linkedPostInCategory.forEach(function (linkedPostInCategory) {
              console.log( "YYY", linkedPostInCategory  .fields.title );
            })

          }
        }
      })
    })

/*
  client.getEntries()
.then(function (entries) {
  // log the title for all the entries that have it
  entries.items.forEach(function (entry) {
    if(entry.fields.title) {
      console.log(entry.fields.title)
    }
  })
})
*/

  query = {}
  query['content_type'] = 'category'
  query['fields.categorySlug'] = categorySlug

  return client.getEntries(query)

}
/*
function getCategories (query) {
  query = query || {}
  query.content_type = 'category'
  return client.getEntries(query)
}
*/
module.exports = {
  getCategory
}
