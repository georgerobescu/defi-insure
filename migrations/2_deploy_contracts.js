var DefiInsure = artifacts.require("./DefiInsure.sol");

module.exports = function(deployer) {
  deployer.deploy(DefiInsure);
};
