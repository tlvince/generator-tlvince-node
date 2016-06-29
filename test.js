/* global describe, it */
'use strict'

const path = require('path')

const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator', () => {
  it('should generate files', function () {
    this.timeout(10000)
    return helpers.run(path.join(__dirname, '/app'))
      .withPrompts({
        moduleName: 'this is good',
        description: 'Nice',
        githubUser: 'tlvince',
        website: 'https://tlvince.com',
        license: 'MIT'
      })
      .toPromise()
      .then(function (dir) {
        console.log(dir)
        assert.file([
          'index.js',
          'README.md',
          'LICENSE'
        ])
      })
  })
})
