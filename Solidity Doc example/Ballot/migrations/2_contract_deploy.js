var Migrations = artifacts.require("./Ballot.sol");

module.exports = function(deployer) {
 deployer.deploy(Migrations,["0x6f6e650000000000000000000000000000000000000000000000000000000000","0x74776f0000000000000000000000000000000000000000000000000000000000","0x7468726565000000000000000000000000000000000000000000000000000000"]);
};