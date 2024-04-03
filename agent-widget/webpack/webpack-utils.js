const path = require('path')

function root(...p) {
  return path.resolve.apply(path, [__dirname, '..'].concat(p.filter(Boolean)))
}

function dist(p) {
  return root('dist', p)
}

function src(p) {
  return root('src', p)
}

function webpack(p) {
  return root('webpack', p)
}

module.exports = {
  paths: {
    dist,
    src,
    webpack,
  },
}
