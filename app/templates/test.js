const test = require('tap').test

const <%= camelModuleName %> = require('./')

test('title', t => {
  t.equal(<%= camelModuleName %>(), 'hello world')
  t.end()
})
