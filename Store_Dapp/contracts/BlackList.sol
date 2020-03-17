pragma solidity 0.4.24;

contract BlackList {
    

    mapping (address => int8) public blackList; 
    address[] internal blackListKey;
     
    // 이벤트 알림
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    
    
    constructor () public{}
    
    // BlackList register
    function setBlacklist(address _addr) public  {
        require(blackList[_addr] == 0, "D");
        blackList[_addr] = 1;
        blackListKey.push(_addr);
        
        emit Blacklisted(_addr);
    }
 
    // BlackList delete
    function deleteBlacklist(address _addr, uint index) public  {
        
        blackList[_addr] = -1;
        delete blackListKey[index];
        emit DeleteFromBlacklist(_addr);
    }
    // BlackList call
    function getBlacklist() view public  returns (address[] memory) {

        return blackListKey;
        
    }
    
    // 블랙리스트 체크
    // function blackListCheck(address _to, uint256 _value) private returns (bool){
    
    //     if (blackList[msg.sender] > 0) {
    //         emit RejectedPaymentFromBlacklistedAddr(msg.sender, _to, _value);
    //         return false;
    //     } else if (blackList[_to] > 0) {
    //         emit RejectedPaymentToBlacklistedAddr(msg.sender, _to, _value);
    //         return false;
    //     }
    //     return true;
    // }
    
}


