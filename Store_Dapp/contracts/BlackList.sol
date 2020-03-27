pragma solidity  ^0.4.24;

contract BlackList {
    mapping (address => int8) public BlackList;
    address[] internal BlackListKey;
    
    // 이벤트 알림
    event BlackListed(address indexed target);
    event DeleteFromBlackList(address indexed target);
    event eventcheckBlackList(int8 sender);

    // BlackList register
    function setBlackList(address _addr) public  {
        require(BlackList[_addr] == 0, "already BlackList");
        BlackList[_addr] = 1;
        BlackListKey.push(_addr);
        emit BlackListed(_addr);
    }
    // BlackList delete
    function deleteBlackList(address _addr, uint index) public  {
        delete BlackList[_addr];
        delete BlackListKey[index];
        emit DeleteFromBlackList(_addr);
    }
    // BlackList call
    function getBlackList() view public  returns (address[] memory) {
        return BlackListKey;
    }
    // 블랙리스트 체크
    function checkBlackList(address _buyer) view public returns (bool){
        bool check = true;
        require(BlackList[_buyer] == 0, "Already BlackList");
        emit eventcheckBlackList(BlackList[_buyer]);
        return check;
    }
    // withdrawal
    function withdrawal(address _buyer) public {
        delete BlackList[_buyer];

        for(uint i = 0; i <BlackListKey.length; i++ ){
            if(BlackListKey[i] == _buyer){
                delete BlackListKey[i];
                break;
            }
        }
        emit DeleteFromBlackList(_buyer);
    }
}


