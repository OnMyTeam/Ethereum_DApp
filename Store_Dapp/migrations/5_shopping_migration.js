var item = artifacts.require("Item");
var membership = artifacts.require("Membership");
var shopping = artifacts.require("Shopping");

module.exports = function(deployer) {
    deployer.deploy(shopping, membership.address, item.address);
};