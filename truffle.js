const HDWalletProvider = require('truffle-hdwallet-provider');
const infura_apikey = '04b7e53ea51a4c85972207c27f35f3f0';
// Either use this key or get yours at https://infura.io/signup. It's free.
const mnemonic = 'champion ski expand average siren innocent law rent choose fatigue session pig';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      gas: 6500000,
      network_id: '5777',
      test: true
    },
    cli: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6721975,
      test: true
    },
    console: {
      host: 'localhost',
      port: 9545,
      network_id: '*',
      gas: 6721975,
      test: true
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/' + infura_apikey),
      network_id: 3,
      gas: 4500000
    },
    live: {
      host: '', // Live network IP address
      port: 80,
      network_id: 1 // Ethereum public network
      // optional config values:
      // gas: Gas limit used for deploys. Default is 4712388
      // gasPrice: Gas price used for deploys. Default is 100000000000 (100 Shannon).
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
    }
  }
};
