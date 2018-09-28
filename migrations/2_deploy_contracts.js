const CarExchange = artifacts.require('./CarExchange.sol');

module.exports = function(deployer) {
  deployer.deploy(CarExchange);
};
