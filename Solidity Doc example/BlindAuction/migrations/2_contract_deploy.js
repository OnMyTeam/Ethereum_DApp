var Migrations = artifacts.require("./BlindAuction.sol");

module.exports = function(deployer) {
 deployer.deploy(Migrations, 180, 180, "0xe734f34d228DEc2bc0af35dDe1EDD785E2317a6a");
};