const Transacoes = artifacts.require("Transacoes");

module.exports = function(deployer) {
  deployer.deploy(Transacoes);
};
