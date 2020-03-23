pragma solidity 0.4.24;

import './Token.sol';

contract Personal is Owned{
    struct Person{
        address account;
        uint tokens;
    }
    struct PersonalStatus {
        string name;
        uint times;
        uint sum;
        int8 rate;
    }
    struct History {
        uint times;
        uint sum;
        uint statusIndex;
    
    }
    PersonalStatus[] public status;
    mapping(address => History) public tradingHistory;
    mapping(address=>Person) public People;

    constructor() public{
        People[msg.sender].account=msg.sender;
        pushStatus("Bronze", 0, 0, 0);
        pushStatus("Silver", 5, 500, 5);
        pushStatus("Gold", 10, 1500, 10);
    }

    function register() public returns(string success) {
        require(People[msg.sender].account == address(0), "Already Register");
        People[msg.sender].account= msg.sender;
        return "success";
        
    }
    function getMemberInfo() public view returns(address addr){
        return People[msg.sender].account;
    }
    // add PersonalStatus
    function pushStatus(string _name, uint _times, uint _sum, int8 _rate) onlyOwner{
        status.push(PersonalStatus({
            name: _name,
            times: _times,
            sum: _sum,
            rate: _rate
        }));
    }
    //
    function updateHistory(address _member, uint _value) {
        tradingHistory[_member].times += 1;
        tradingHistory[_member].sum += _value;
        uint index;
        int8 tmprate;
        
        for(uint i =0; i < status.length; i++){
            if(tradingHistory[_member].times >= status[i].times && tradingHistory[_member].sum >= status[i].sum){
                index = i;
            }
        }
        tradingHistory[_member].statusIndex = index;
    }
    function getCashbackRate(address _member) constant returns (int8 rate){
        rate = status[tradingHistory[_member].statusIndex].rate;
    }
    // withdrawal
    function withdrawal(address _buyer) public {
        delete tradingHistory[_buyer];
        delete People[_buyer]; 

    }    
}
