pragma solidity 0.4.24;

contract Personal {
    struct Person{
        address account;
        uint tokens;
    }
    mapping(address=>Person) People;

    constructor() public{
        People[msg.sender].account=msg.sender;
    }

    function register() public returns(string success) {
        require(People[msg.sender].account == address(0));
        // if(People[msg.sender].account!=address(0)) return "fail"; 
        // else {
            People[msg.sender].account= msg.sender;
            return "success";
        // }
    }
    function getMemberInfo() public view returns(address addr){
        return People[msg.sender].account;
    }
}
