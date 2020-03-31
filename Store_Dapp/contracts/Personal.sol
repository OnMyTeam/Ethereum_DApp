pragma solidity >=0.4.21 <0.7.0;

import './Ownable.sol';

contract Personal is Ownable{


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
    mapping(address => bool) public people;
    address[] public peopleList;

    //블랙리스트 관련 변수
    mapping (address => int8) public blacklist;
    address[] internal blacklistKey;
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    event EventcheckBlacklist(int8 sender);


    constructor() public{
        people[msg.sender] = true;
        peopleList.push(msg.sender);

        pushStatus("Bronze", 0, 0, 0);
        pushStatus("Silver", 5, 500, 5);
        pushStatus("Gold", 10, 1500, 10);
    }

    function register() public returns(bool succes) {                   //personalRegister 로 이름 바꾸면 어떨까..
        require(people[msg.sender] == false, "Already Register");
        people[msg.sender] = true;
        peopleList.push(msg.sender);

        return true;
    }

    function getMemberInfo() public view returns(bool){
        return people[msg.sender];
    }

    function pushStatus(string memory _name, uint _times, uint _sum, int8 _rate) public onlyOwner{
        status.push(PersonalStatus({
            name: _name,
            times: _times,
            sum: _sum,
            rate: _rate
        }));
    }

    function updateHistory(address _member, uint _value) public {
        uint index;

        tradingHistory[_member].times += 1;
        tradingHistory[_member].sum += _value;

        for(uint i = 0; i<status.length; i++){
            if(tradingHistory[_member].times >= status[i].times && tradingHistory[_member].sum >= status[i].sum){
                index = i;
            }
        }
        tradingHistory[_member].statusIndex = index;
    }

    function getCashbackRate(address _member) public view returns (int8 rate){
        rate = status[tradingHistory[_member].statusIndex].rate;
    }

    function getGrade(address _member) public view returns (string memory grade){
        grade = status[tradingHistory[_member].statusIndex].name;
    }

    function getMemberList() public view returns (address[] memory){
        return peopleList;
    }

    function withdrawal(address _buyer) public {
        delete tradingHistory[_buyer];
        delete people[_buyer];
        delete blacklist[_buyer];
        for(uint i = 0; i<blacklistKey.length; i++){
            if(blacklistKey[i] == _buyer){
                delete blacklistKey[i];
                break;
            }
        }
        emit DeleteFromBlacklist(_buyer);
    }

    /*블랙 리스트 관련 함수*/
    function setBlacklist(address _addr) public  {
        require(blacklist[_addr] == 0, "already blacklist");
        blacklist[_addr] = 1;
        blacklistKey.push(_addr);
        emit Blacklisted(_addr);
    }

    function deleteBlacklist(address _addr, uint index) public {
        delete blacklist[_addr];
        delete blacklistKey[index];
        emit DeleteFromBlacklist(_addr);
    }

    function getBlacklist() public view returns(address[] memory) {
        return blacklistKey;
    }

    function checkBlacklist(address _buyer) public returns(bool) {
        bool check = true;
        require(blacklist[_buyer] == 0, "Already blacklist");
        emit EventcheckBlacklist(blacklist[_buyer]);
        return check;
    }

}
