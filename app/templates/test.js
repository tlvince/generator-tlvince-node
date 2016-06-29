'use strict'

var test = require('tap').test

var <%= camelModuleName %> = require('./')

test('title', function (t) {
  t.equal(<%= camelModuleName %>(), 'hello world')
  t.end()
})
