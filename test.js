/* global describe, it */
'use strict'

const path = require('path')

const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator', () => {
  it('should generate files', function (done) {
    this.timeout(10000)
    helpers.run(path.join(__dirname, '/app'))
      .withPrompts({
        moduleName: 'this is good',
        description: 'Nice',
        githubUser: 'tlvince',
        website: 'https://tlvince.com',
        license: 'MIT'
      })
      .on('end', () => {
        assert.file([
          'index.js',
          'README.md',
          'LICENSE'
        ])
        done()
      })
  })
})
