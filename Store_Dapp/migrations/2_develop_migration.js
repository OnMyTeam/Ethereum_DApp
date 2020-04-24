var membership = artifacts.require("Membership");
var osdcToken = artifacts.require("OSDCToken");
var item = artifacts.require("Item");
var shopping = artifacts.require("Shopping");

module.exports = async function(deployer) {
  await deployer.deploy(osdcToken);
  await deployer.deploy(membership, osdcToken.address);
  await deployer.deploy(item);
  await deployer.deploy(shopping, membership.address, item.address);
};