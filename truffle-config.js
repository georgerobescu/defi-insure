const path = require("path");
const keys = require('./keys');
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1001"
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(keys.privKey, keys.infura);
      },
      network_id: 4
    }
  }
};
