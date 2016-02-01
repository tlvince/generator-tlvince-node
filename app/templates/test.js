'use strict'

var test = require('tape')

var <%= camelModuleName %> = require('./')

test('title', function (t) {
  t.equal(<%= camelModuleName %>(), 'hello world')
  t.end()
})
