pragma solidity  >=0.4.24 <0.7.0;

contract BlackList {
    

    mapping (address => int8) public blackList; 
    address[] internal blackListKey;
    // 이벤트 알림
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    event eventcheckBlacklist(int8 sender);
    // BlackList register
    function setBlacklist(address _addr) public  {
        require(blackList[_addr] == 0, "already blacklist");
        blackList[_addr] = 1;
        blackListKey.push(_addr);
        emit Blacklisted(_addr);
    }

    // BlackList delete
    function deleteBlacklist(address _addr, uint index) public  {
        delete blackList[_addr];
        delete blackListKey[index];
        emit DeleteFromBlacklist(_addr);
    }
    // BlackList call
    function getBlacklist() view public  returns (address[] memory) {

        return blackListKey;
    }
    // 블랙리스트 체크
    function checkBlacklist(address _buyer) view public returns (bool){
        bool check = true;
        
        require(blackList[_buyer] == 0, "Already blacklist");
        emit eventcheckBlacklist(blackList[_buyer]);
        return check;
    }
    // withdrawal
    function withdrawal(address _buyer) public {

        delete blackList[_buyer];
        
        for(uint i = 0; i <blackListKey.length; i++ ){
            if(blackListKey[i] == _buyer){
                delete blackListKey[i];
                break;
            }
        }        
        emit DeleteFromBlacklist(_buyer);
    }
}


