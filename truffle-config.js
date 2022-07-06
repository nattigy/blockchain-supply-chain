// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777
    },
    rinkeby: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 1
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
}
