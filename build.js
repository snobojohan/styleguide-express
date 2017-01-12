const glob = require('glob')
const Metalsmith = require('metalsmith')
const layouts = require('metalsmith-layouts')
const assets = require('metalsmith-assets')
const sass = require('metalsmith-sass')
const markdown = require('metalsmith-markdown')
const dataMarkdown = require('metalsmith-data-markdown')
const contentful = require('contentful-metalsmith')

const handlebars = require('handlebars')

// add custom helpers to handlebars
// https://github.com/superwolff/metalsmith-layouts/issues/63
//
// using the global handlebars instance
glob.sync('helpers/*.js').forEach((fileName) => {
  const helper = fileName.split('/').pop().replace('.js', '')

  handlebars.registerHelper(
    helper,
    require(`./${fileName}`)
  )
})

Metalsmith(__dirname)
  .source('src')
  .destination('build')
  .use(contentful({
    space_id: 'kva0nyzen4yv',
    access_token: '2d99eaea9ddc9b833b8388f677389bb078d2fbdc2da89712f365123081e791e7',
  }))
  .use(layouts({
    directory: 'layouts',
    engine: 'handlebars',
    partials: 'partials'
  }))
  .use(assets({
    source: 'public/',
    destination: 'assets/'
  }))
  .use(sass({
    outputStyle: 'compressed'
  }))
  .use(markdown())
  .use(dataMarkdown({
    removeAttributeAfterwards: true
  }))
  .build(function (err) {
    if (err) throw err

    console.log('Successfully generated static pages from Contentful content.')
  })
