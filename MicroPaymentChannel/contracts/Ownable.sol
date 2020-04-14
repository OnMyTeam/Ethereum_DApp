pragma solidity 0.6.4;

contract Ownable {
  address payable public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender==owner,"not a owner");
    _;
  }

  function transferOwnership(address payable newOwner) public onlyOwner {
    require(newOwner!=address(0),"cannot transfer the ownership");
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}