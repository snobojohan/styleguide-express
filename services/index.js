var client = require('./contentfulClient').client

function getContent () {
  query = {}
  query['content_type'] = 'category'
  return client.getEntries(query)
}

function getMenu(entries, postSlug){

  console.log("€€€€€ ", postSlug)

  var menu = {items:[]};

  entries.items.forEach(function (entry) {
    if(entry.fields.categoryName) {
      if( entry.fields.postsInCategory ) {
        entry.fields.postsInCategory.forEach(function (postsInCategory) {
          console.log( ">>>", postsInCategory.fields.title, postsInCategory.fields.slug );
          if(postsInCategory.fields.slug === postSlug){
            // TODO: active
          }
        })

        menu.items.push(
          {
            categoryName: entry.fields.categoryName,
            slug: entry.fields.slug,
            active: false, // TODO: HEre
            children: [
              { foo: "bar"},
              { foo: "rab" }
            ]
          }
        )

      }
    }

  })
  console.log(menu);
  return "Fooooo " + postSlug
}

function getPost(contentAndMenu){
  return "Bar"
}

module.exports = {
  getContent,
  getMenu,
  getPost
}
