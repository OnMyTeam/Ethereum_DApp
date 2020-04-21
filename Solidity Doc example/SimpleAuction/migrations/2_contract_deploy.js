var Migrations = artifacts.require("./SimpleAuction.sol");

module.exports = function(deployer) {
 deployer.deploy(Migrations, 120, "0xe734f34d228DEc2bc0af35dDe1EDD785E2317a6a");
};