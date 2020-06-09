pragma solidity >=0.4.25 <0.7.0;
import "./Assert.sol";
import "./DeployedAddresses.sol";
import "../contracts/Token.sol";

contract TestMetaCoin {

  function testTotalSupplyDeployedContract() public {
    OSDCToken osdc = OSDCToken(DeployedAddresses.Token());

    uint expected = 10000000000;

    Assert.equal(osdc.CABalance, expected, "Owner should have 10000000000 OSDC Token initially");
  }

  function testTotalSupplyNewContract() public {
    OSDCToken osdc = new OSDCToken();

    uint expected = 10000000000;

    Assert.equal(osdc.CABalance, expected, "Owner should have 10000000000 OSDC Token initially");
  }


}
