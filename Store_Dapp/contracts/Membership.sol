pragma solidity >=0.4.21 <0.7.0;

import './Ownable.sol';

contract Membership is Ownable{

    struct MemberInfo {
        uint buyCount;
        uint sum;
        uint statusIndex;
        
    }
    
    struct GradeStatus {
        string name;
        uint buyCount;
        uint sum;
        int8 rate;
    }

    
    GradeStatus[] public status;
    mapping(address => MemberInfo) public tradingHistory;
    mapping(address => bool) public people;
    address[] public peopleList;

    //블랙리스트 관련 변수
    mapping (address => int8) public mappingBlacklist;
    address[] internal arrayBlacklist;
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

    function registerMember() public returns(bool) {                   //memberRegister 로 이름 바꾸면 어떨까..
        require(people[msg.sender] == false, "Already Register");
        people[msg.sender] = true;
        peopleList.push(msg.sender);

        return true;
    }

    function getMemberInfo() public view returns(bool){
        return people[msg.sender];
    }

    function pushStatus(string memory _name, uint _times, uint _sum, int8 _rate) public onlyOwner{
        status.push(GradeStatus({
            name: _name,
            buyCount: _times,
            sum: _sum,
            rate: _rate
        }));
    }

    function updateHistory(address _member, uint _value) public {
        uint index;

        tradingHistory[_member].buyCount += 1;
        tradingHistory[_member].sum += _value;

        for(uint i = 0; i<status.length; i++){
            if(tradingHistory[_member].buyCount >= status[i].buyCount && tradingHistory[_member].sum >= status[i].sum){
                index = i;
            }
        }
        tradingHistory[_member].statusIndex = index;
    }

    function getCashbackRate(address _member) public view returns (int8){
        return status[tradingHistory[_member].statusIndex].rate;
        
    }

    function getGrade(address _member) public view returns (string memory){
        return status[tradingHistory[_member].statusIndex].name;
    }

    function getMemberList() public view returns (address[] memory){
        return peopleList;
    }

    function deleteMemberInfo(address _buyer) public {
        delete tradingHistory[_buyer];
        delete people[_buyer];
        delete mappingBlacklist[_buyer];
        for(uint i = 0; i<arrayBlacklist.length; i++){
            if(arrayBlacklist[i] == _buyer){
                delete arrayBlacklist[i];
                break;
            }
        }
        emit DeleteFromBlacklist(_buyer);
    }

    /*블랙 리스트 관련 함수*/
    function setBlacklist(address _addr) public  {
        require(mappingBlacklist[_addr] == 0, "already blacklist");
        mappingBlacklist[_addr] = 1;
        arrayBlacklist.push(_addr);
        emit Blacklisted(_addr);
    }

    function deleteBlacklist(address _addr, uint index) public {
        delete mappingBlacklist[_addr];
        delete arrayBlacklist[index];
        emit DeleteFromBlacklist(_addr);
    }

    function getBlacklist() public view returns(address[] memory) {
        return arrayBlacklist;
    }

    function checkBlacklist(address _buyer) public returns(bool) {
        bool check = true;
        require(mappingBlacklist[_buyer] == 0, "Already blacklist");
        emit EventcheckBlacklist(mappingBlacklist[_buyer]);
        return check;
    }

}