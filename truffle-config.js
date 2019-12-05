const path = require("path");
const keys = require('./keys');
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, keys.infura);
      },
      network_id: 4
    }
  }
};
