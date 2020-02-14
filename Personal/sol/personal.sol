pragma solidity >=0.4.24 <0.6.2;
import "./ERC20.sol";


// (2) 회원 관리용 계약
contract Members is Owned {
    // (3) 상태 변수 선언
    address public coin; // 토큰(가상 화폐) 주소
    MemberStatus[] public status; // 회원 등급 배열
    mapping(address => History) public tradingHistory; // 회원별 거래 이력
     
    // (4) 회원 등급용 구조체
    struct MemberStatus {
        string name; // 등급명
        uint256 times; // 최저 거래 회수
        uint256 sum; // 최저 거래 금액
        int8 rate; // 캐시백 비율
    }
    // 거래 이력용 구조체
    struct History {
        uint256 times; // 거래 회수
        uint256 sum; // 거래 금액
        uint256 statusIndex; // 등급 인덱스
    }
 
    // (5) 토큰 한정 메서드용 수식자
    modifier onlyCoin() { 
        require(msg.sender == coin);
        _; 
    }
     
    // (6) 토큰 주소 설정
    // 
    function setCoin(address _addr) public onlyOwner {
        coin = _addr;
    }
     
    // (7) 회원 등급 추가
    function pushStatus(string memory _name, uint256 _times, uint256 _sum, int8 _rate) public onlyOwner {
        status.push(MemberStatus({
            name: _name,
            times: _times,
            sum: _sum,
            rate: _rate
        }));
    }
 
    // (8) 회원 등급 내용 변경
    function editStatus(uint256 _index, string memory _name, uint256 _times, uint256 _sum, int8 _rate) public onlyOwner {
        if (_index < status.length) {
            status[_index].name = _name;
            status[_index].times = _times;
            status[_index].sum = _sum;
            status[_index].rate = _rate;
        }
    }
     
    // (9) 거래 내역 갱신
    function updateHistory(address _member, uint256 _value) public onlyCoin {
        tradingHistory[_member].times += 1;
        tradingHistory[_member].sum += _value;
        // 새로운 회원 등급 결정(거래마다 실행)
        uint256 index;
        int8 tmprate;
        for (uint i = 0; i < status.length; i++) {
            // 최저 거래 횟수, 최저 거래 금액 충족 시 가장 캐시백 비율이 좋은 등급으로 설정
            if (tradingHistory[_member].times >= status[i].times &&
                tradingHistory[_member].sum >= status[i].sum &&
                tmprate < status[i].rate) {
                index = i;
            }
        }
        tradingHistory[_member].statusIndex = index;
    }

    // (10) 캐시백 비율 획득(회원의 등급에 해당하는 비율 확인)
    function getCashbackRate(address _member) view public returns (int8 rate) {
        rate = status[tradingHistory[_member].statusIndex].rate;
    }
}
     
// (11) 회원 관리 기능이 구현된 가상 화폐
contract OreOreCoin is FixedSupplyToken{
    // 상태 변수 선언

    mapping (address => int8) public blackList; // 블랙리스트
    address[] internal blackListKey;
    mapping (address => Members) public members; // 각 주소의 회원 정보
     
    // 이벤트 알림
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);
    event RejectedPaymentToBlacklistedAddr(address indexed from, address indexed to, uint256 value);
    event RejectedPaymentFromBlacklistedAddr(address indexed from, address indexed to, uint256 value);
    event Cashback(address indexed from, address indexed to, uint256 value);
     
    // 생성자
    constructor () public FixedSupplyToken(10000, "OSDC", "OS", 0){}
    
    // 토큰 잔액 조회
     function getBalanceOf() view public returns (uint256){
        return balances[msg.sender];
    }   
    // 주소를 블랙리스트에 등록
    function blacklisting(address _addr) public onlyOwner {
        blackList[_addr] = 1;
        blackListKey.push(_addr);
        
        emit Blacklisted(_addr);
    }
 
    // 주소를 블랙리스트에서 해제
    function deleteFromBlacklist(address _addr) public onlyOwner {
        
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
    function getBlacklist() view public onlyOwner returns (address[] memory) {

        return blackListKey;
        
    }

 
    // 회원 관리 계약 설정
    function setMembers(address _members) public onlyOwner{
        Members nmembers = Members(_members);
        members[_members] = nmembers;

    }
 
    // 송금
    function transferToken(address _to, uint256 _value) public {
        
        require(balances[msg.sender] >= _value);
        require((balances[_to] + _value) > balances[_to]);
        
        
        // 부정 송금 확인
        // 블랙리스트에 존재하는 계정은 입출금 불가
        if(blackListCheck(_to, _value)){
            // (12) 캐시백 금액을 계산(각 대상의 비율을 사용)
            // uint256 cashback = 0;
            //if(_to > address(0)) {
            //    cashback = _value / 100 * uint256(members[_to].getCashbackRate(msg.sender));
            //    members[_to].updateHistory(msg.sender, _value);
            //}
 
            //balanceOf[msg.sender] -= (_value - cashback);
            //balanceOf[_to] += (_value - cashback);
            // balances[msg.sender] -= (_value);
            //balances[_to] += (_value);
            // emit Transfer(msg.sender, _to, _value);
            transfer(_to, _value);
            //emit Cashback(_to, msg.sender, cashback);
        }


    }
    // 블랙리스트 체크
    function blackListCheck(address _to, uint256 _value) private returns (bool){
    
        if (blackList[msg.sender] > 0) {
            emit RejectedPaymentFromBlacklistedAddr(msg.sender, _to, _value);
            return false;
        } else if (blackList[_to] > 0) {
            emit RejectedPaymentToBlacklistedAddr(msg.sender, _to, _value);
            return false;
        }
        return true;
    }
    
}


