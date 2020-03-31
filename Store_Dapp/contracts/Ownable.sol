pragma solidity >=0.4.21 <0.7.0;

contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender==owner,"not a owner");
    _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner!=address(0),"cannot transfer the ownership");
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}