pragma solidity ^0.4.24;

contract BlackList {
    // 상태 변수 선언

    mapping (address => int8) public blackList; // 블랙리스트
    address[] internal blackListKey;
     
    // 이벤트 알림
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    
    
    constructor () public{}
    
    // 주소를 블랙리스트에 등록
    function blacklisting(address _addr) public  {
        blackList[_addr] = 1;
        blackListKey.push(_addr);
        
        emit Blacklisted(_addr);
    }
 
    // 주소를 블랙리스트에서 해제
    function deleteFromBlacklist(address _addr) public  {
        
        blackList[_addr] = -1;
        for(uint i = 0; i <blackListKey.length; i++ ){
            if(blackListKey[i] == _addr){
                delete blackListKey[i];
                break;
            }
        }
        emit DeleteFromBlacklist(_addr);
    }
    // 블랙리스트 조회
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


