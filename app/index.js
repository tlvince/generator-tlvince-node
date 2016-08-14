'use strict'

const yeoman = require('yeoman-generator')
const askName = require('inquirer-npm-name')
const kebabCase = require('lodash.kebabcase')
const camelCase = require('lodash.camelcase')
const normalizeUrl = require('normalize-url')

module.exports = yeoman.Base.extend({
  prompting: {
    askForModuleName: function () {
      return askName({
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: this.appname.replace(/\s/g, '-'),
        filter: (x) => kebabCase(x),
        validate: function (str) {
          return str.length > 0
        }
      }, this)
      .then(function (moduleName) {
        this.props = Object.assign({}, moduleName)
      }.bind(this))
    },
    askFor: function () {
      return this.prompt([
        {
          name: 'description',
          message: 'What is the module description?',
          validate: (x) => {
            if (!x.length) {
              return 'You have to provide a description'
            }
            if (x.length > 72) {
              return 'Keep the description below 72 characters'
            }
            return true
          },
          filter: (x) => x.trim().charAt(0).toUpperCase() + x.trim().slice(1)
        },
        {
          name: 'keywords',
          message: 'What are the keywords of this module (comma separated)?',
          validate: (x) => x.length > 0 ? true : 'You have to provide some keywords',
          filter: (x) => x.split(',').map(k => k.trim()).filter(k => k)
        },
        {
          name: 'githubUsername',
          message: 'What is your GitHub username?',
          store: true,
          validate: (x) => x.length > 0 ? true : 'You have to provide a username'
        },
        {
          name: 'website',
          message: 'What is the URL of your website?',
          store: true,
          validate: (x) => x.length > 0 ? true : 'You have to provide a website URL',
          filter: (x) => normalizeUrl(x)
        },
        {
          name: 'cli',
          message: 'Do you need a CLI?',
          type: 'confirm',
          default: false
        }
      ])
      .then(function (props) {
        Object.assign(this.props, props)
        this.props.name = this.user.git.name()
        this.props.email = this.user.git.email()
      }.bind(this))
    }
  },
  default: {
    license: function () {
      // Updates package.json for us (as well as creating LICENSE)
      this.composeWith('license', {
        options: {
          name: this.props.name,
          email: this.props.email,
          website: this.props.website
        }
      }, {
        local: require.resolve('generator-license/app')
      })
    },

    readme: function () {
      this.composeWith('readme', {
        options: {
          appname: this.props.moduleName,
          description: this.props.description,
          keywords: this.props.keywords,
          author: this.props.name,
          email: this.props.email,
          website: this.props.website,
          githubUser: this.props.githubUsername,
          isNodeModule: true
        }
      }, {
        local: require.resolve('generator-readme/app')
      })
    },

    git: function () {
      this.spawnCommandSync('git', ['init'])
    }
  },
  writing: function () {
    const done = this.async()

    const tpl = Object.assign({}, this.props, {
      camelModuleName: camelCase(this.props.moduleName)
    })

    if (tpl.cli) {
      tpl.keywords = tpl.keywords.concat(['cli', 'cli-app'])
    }

    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    }

    this.fs.copyTpl([
      `${this.templatePath()}/**`,
      '!**/cli.js'
    ], this.destinationPath(), tpl)

    if (this.props.cli) {
      this.fs.copyTpl(this.templatePath('cli.js'), this.destinationPath('cli.js'), tpl)
    }

    mv('editorconfig', '.editorconfig')
    mv('gitattributes', '.gitattributes')
    mv('gitignore', '.gitignore')
    mv('vimrc', '.vimrc')
    mv('_package.json', 'package.json')

    done()
  },

  install: function () {
    this.installDependencies({bower: false})
  }
})
