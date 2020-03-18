pragma solidity  >=0.4.24 <0.7.0;

contract BlackList {
    

    mapping (address => int8) public blackList; 
    address[] internal blackListKey;
    // 이벤트 알림
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    // BlackList register
    function setBlacklist(address _addr) public  {
        require(blackList[_addr] == 0, "already blacklist");
        blackList[_addr] = 1;
        blackListKey.push(_addr);
        emit Blacklisted(_addr);
    }

    // BlackList delete
    function deleteBlacklist(address _addr, uint index) public  {
        blackList[_addr] = 0;
        delete blackListKey[index];
        emit DeleteFromBlacklist(_addr);
    }
    // BlackList call
    function getBlacklist() view public  returns (address[] memory) {

        return blackListKey;
    }
    // 블랙리스트 체크
    function checkBlacklist() view public returns (bool){
        bool check = true;
        require(blackList[msg.sender] == 0, "Already blacklist");

        return check;
    }
}


