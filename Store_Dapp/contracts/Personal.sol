pragma solidity >=0.4.21 <0.7.0;

import './Ownable.sol';

contract Personal is Ownable{
    //회원 관련 변수
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
    mapping(address => bool) public People;
    address[] public PeopleList;

    //블랙리스트 관련 변수
    mapping (address => int8) public BlackList;
    address[] internal BlackListKey;
    event BlackListed(address indexed target);
    event DeleteFromBlackList(address indexed target);
    event eventcheckBlackList(int8 sender);


    constructor() public{
        People[msg.sender] = true;
        PeopleList.push(msg.sender);

        pushStatus("Bronze", 0, 0, 0);
        pushStatus("Silver", 5, 500, 5);
        pushStatus("Gold", 10, 1500, 10);
    }

    function register() public returns(bool succes) {
        require(People[msg.sender] == false, "Already Register");
        People[msg.sender] = true;
        PeopleList.push(msg.sender);

        return true;
    }

    function getMemberInfo() public view returns(bool){
        return People[msg.sender];
    }

    function pushStatus(string _name, uint _times, uint _sum, int8 _rate) onlyOwner{
        status.push(PersonalStatus({
            name: _name,
            times: _times,
            sum: _sum,
            rate: _rate
        }));
    }

    function updateHistory(address _member, uint _value) {
        uint index;
        int8 tmprate;

        tradingHistory[_member].times += 1;
        tradingHistory[_member].sum += _value;

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

    function getGrade(address _member) constant returns (string grade){
        grade = status[tradingHistory[_member].statusIndex].name;
    }

    function getMemberList() public view returns (address[] memory){
        return PeopleList;
    }

    function withdrawal(address _buyer) public {
        delete tradingHistory[_buyer];
        delete People[_buyer];
        delete BlackList[_buyer];
        for(uint i = 0; i <BlackListKey.length; i++ ){
            if(BlackListKey[i] == _buyer){
                delete BlackListKey[i];
                break;
            }
        }
        emit DeleteFromBlackList(_buyer);
    }

    /*블랙 리스트 관련 함수*/
    function setBlackList(address _addr) public  {
        require(BlackList[_addr] == 0, "already BlackList");
        BlackList[_addr] = 1;
        BlackListKey.push(_addr);
        emit BlackListed(_addr);
    }

    function deleteBlackList(address _addr, uint index) public  {
        delete BlackList[_addr];
        delete BlackListKey[index];
        emit DeleteFromBlackList(_addr);
    }

    function getBlackList() view public  returns (address[] memory) {
        return BlackListKey;
    }

    function checkBlackList(address _buyer) view public returns (bool){
        bool check = true;
        require(BlackList[_buyer] == 0, "Already BlackList");
        emit eventcheckBlackList(BlackList[_buyer]);
        return check;
    }

}
