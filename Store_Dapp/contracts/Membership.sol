pragma solidity 0.6.4;
import './Ownable.sol';
import './Token.sol';

contract Membership is Ownable{

    OSDCToken public basicToken;                   //물건 구입시 토큰 차감을 위한 토큰 컨트랙트 객체 생성
    //회원 등급을 결정 하기 위한 구매 정보 포함
    struct MemberInfo {
        uint buyCount;
        uint sum;
        uint statusIndex;
    }

    //등급 별 구매 횟수, 할인 율 등의 정보 포함
    struct GradeStatus {
        string name;
        uint buyCount;
        uint sum;
        int8 rate;
    }

    GradeStatus[] public status;                                //등급의 정보를 담고 있는 배열
    mapping(address => MemberInfo) public purchaseHistory;      //각 회원 별 구매 정보를 담고 있음
    mapping(address => bool) public members;                    //회원이 등록되어 있는지 확인하기 위함
    address[] public memberlist;                                //가입된 회원의 어카운트 리스트

    //블랙리스트 관련 변수
    mapping (address => int8) public mappingBlacklist;          //조회환 회원이 블랙리스트를 체크하기 위한 매핑 배열
    address[] internal arrayBlacklist;                          //블랙리스트로 등록된 어카운트 리스트

    event blacklisted(address indexed target);                  // 블랙리스트로 지정된 후 출력하는 이벤트
    event deletedBlacklist(address indexed target);          // 블랙리스트를 해제하고 나서 출력

    constructor(address payable _basicTokenAddr) public{
        basicToken = OSDCToken(_basicTokenAddr);
        //관리자 회원 가입
        members[msg.sender] = true;
        memberlist.push(msg.sender);

        //등급 설정
        setGrade("Bronze", 0, 0, 0);
        setGrade("Silver", 3, 1500, 5);
        setGrade("Gold", 5, 2500, 10);
    }

    function registerMember() public returns(bool success) {
        //이미 등록 되어 있는지 확인
        require(members[msg.sender] == false, "Already Register");

        //회원 추가
        members[msg.sender] = true;
        memberlist.push(msg.sender);

        return true;
    }

    function getMemberInfo() public view returns(bool success) {    //트랜잭션 발행한 사람이 등록되어 있는지 확인
        return members[msg.sender];
    }

    function setGrade(string memory _name, uint _times, uint _sum, int8 _rate) public onlyOwner{  //등급 설정
        status.push(GradeStatus({
            name: _name,
            buyCount: _times,
            sum: _sum,
            rate: _rate
        }));
    }

    //물건을 구매 한 후 구매 이력 업데이트 / 등급 변경
    function updateHistory(address _member, uint _value) public {
        uint index;

        purchaseHistory[_member].buyCount += 1;         //사용자의 총 구매숫자 +1
        purchaseHistory[_member].sum += _value;         //사용자의 총 구매금액 더하기

        for(uint i = 0; i<status.length; i++){
            if(purchaseHistory[_member].buyCount >= status[i].buyCount && purchaseHistory[_member].sum >= status[i].sum) {
                index = i;
            }
        }
        purchaseHistory[_member].statusIndex = index;
    }

    //사용자가 속한 등급의 할인율 출력
    function getCashbackRate(address _member) public view returns (int8 rate) {
        return status[purchaseHistory[_member].statusIndex].rate;
    }

    //사용자의 등급 출력
    function getGrade(address _member) public view returns (string memory name) {
        return status[purchaseHistory[_member].statusIndex].name;
    }

    //가입한 회원의 전체 목록 출력
    function getMemberList() public view returns (address[] memory peoplelist) {
        return memberlist;
    }

    //회원의 개인 정보 삭제
    function deleteMemberInfo(address _buyer) public {
        delete purchaseHistory[_buyer];                     //회원의 물건 구매 히스토리 삭제
        delete members[_buyer];                             //가입한 회원의 매핑 배열에서 삭제
        emit deletedBlacklist(_buyer);
    }

    /*블랙 리스트 관련 함수*/
    //블랙리스트 등록
    function setBlacklist(address _addr) public  {
        require(mappingBlacklist[_addr] == 0, "already blacklist");
        mappingBlacklist[_addr] = 1;
        arrayBlacklist.push(_addr);
        emit blacklisted(_addr);
    }

    //블랙리스트 삭제
    function deleteBlacklist(address _addr, uint index) public {
        delete mappingBlacklist[_addr];
        delete arrayBlacklist[index];
        emit deletedBlacklist(_addr);
    }

    //모든 블랙리스트 회원의 리스트 출력
    function getBlacklist() public view returns(address[] memory arrayBlackList) {
        return arrayBlacklist;
    }

    //입력받은 사용자가 블랙리스트로 등록되어 있는지 확인
    function checkBlacklist(address _buyer) public view returns(bool success) {
        bool check = true;
        require(mappingBlacklist[_buyer] == 0, "Already blacklist");
        return check;
    }

}
