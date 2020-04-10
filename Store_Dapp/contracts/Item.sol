pragma solidity 0.6.4;

import './libray.sol';
import './Ownable.sol';
import './Membership.sol';
import './Token.sol';

contract Item is Ownable{
    using SafeMath for uint;                //overflow, underflow를 막기 위한 safemath library 사용
    Membership membership;                  //회원 가입 contract를 사용하기 위하여 객체 생성
    OSDCToken basictoken;                   //물건 구입시 토큰 차감을 위한 토큰 컨트랙트 객체 생성

    struct itemInfo{                        //아이템의 정보를 나타냄
        uint code;                          //물건을 표현하기 위한 유니크한 아이템코드
        uint cost;                          //물건 가격
        string name;                        //물건 이름
        string imgsrc;                      //물건 사진 소스
        uint8 buy;
    }
    mapping(uint=> itemInfo) public itemArray;                  //아이템 코드가 아이템 정보로 매핑되어 있는 배열
    mapping(address=> itemInfo[]) public membershipItems;       //사용자가 구매한 아이템의 배열로 매핑되어 있는 배열
    uint public itemCode;                                       //유니크한 아이템 코드를 만들기 위한 변수

    event  ItemInfo(uint code, string name,string imgsrc, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor(address payable __basictokenAddr, address payable _membershipAddr) public {
        itemCode = 0;
        //생성한 객체를 contract address로 인스턴스 생성
        basictoken = OSDCToken(__basictokenAddr);
        membership = Membership(_membershipAddr);
    }

    //물건 등록
    function registerItem(string memory _name, string memory _imgsrc, uint _cost) public onlyOwner returns(bool success) {
        itemArray[itemCode] = itemInfo(itemCode, _cost, _name, _imgsrc, 0);
        itemCode = itemCode + 1;
        return true;
    }

    //사용자가 입력한 아이템 코드를 가지는 물건 구매
    function buyItem(address _buyer, uint _index) public returns(bool success) {
        uint8 rate;
        uint cost;
        uint cashBack;
        uint dcCost;

        membership.checkBlacklist(_buyer);                      //사용자가 블랙리스트 인지 확인
        cost = itemArray[_index].cost;                          //사용자가 구매를 원하는 물건의 가격
        rate = uint8(membership.getCashbackRate(_buyer));       //사용자의 등급의 할인율 계산
        //ntokens = cost.mul((100-rate)/100);                     //물건의 가격 계산
        cashBack = cost.div(100).mul(rate);
        dcCost = cost.sub(cashBack);
        basictoken.transfer(owner, dcCost);                    //사용자가 가진 토큰을 물건의 가격 만큼 관리자에게 전송

        membership.updateHistory(_buyer, cost);                 //사용자의 구매 정보 업데이트
        itemArray[_index].buy = 1;
        membershipItems[_buyer].push(itemArray[_index]);        //사용자별 구매한 아이템 배열에 구매한 아이템 정보 추가

        emit ItemInfo(itemArray[_index].code, itemArray[_index].name,itemArray[_index].imgsrc, itemArray[_index].cost);
        return true;
    }

    //아이템 삭제
    function deleteItem(uint _code) public onlyOwner returns(bool success) {
        delete itemArray[_code];
        return true;
    }

    //사용자가 구매한 아이템 삭제
    function deleteMyItem(address _buyer, uint _index) public returns(bool success) {
        delete membershipItems[_buyer][_index];
        return true;
    }

    //등록되어 있는 모든 아이템 출력
    function getItems() public view returns(string memory itemsJson){
        //등록 되어 있는 모든 아이템 정보를 string으로 표현(JSON 형태로 표현)
        //ex: [{itemCode: 1, cost: 3, imsgsrc:"./phone_1.jpg", name:"samsungphone"}, ...]
        
        itemsJson = '[';
        for(uint i = 0; i <= itemCode; i++){
            string memory code = ConvertDataType.uintToStr(itemArray[i].code);
            string memory cost = ConvertDataType.uintToStr(itemArray[i].cost);
            string memory imgsrc = itemArray[i].imgsrc;
            string memory name = itemArray[i].name;
            string memory buy = ConvertDataType.uintToStr(itemArray[i].buy);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', code, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :', cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "buy" :', buy, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgsrc" : "', imgsrc, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', name, '"},'));

        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "X"} ]'));
        return itemsJson;
    }

    //사용자가 구매한 물건의 정보 출력
    function getMyItems(address _buyer) public view returns(string memory itemsJson) {
        //표현 방식은 getItems 함수 와 동일
        itemInfo[] storage items = membershipItems[_buyer];
        itemsJson = '[';

        for( uint i = 0; i<items.length; i++ ){
            string memory code = ConvertDataType.uintToStr(items[i].code);
            string memory cost = ConvertDataType.uintToStr(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory id = ConvertDataType.uintToStr(i);

            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }

            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', code, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" : ', cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgsrc" : "', imgsrc, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', name, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "id" :', id, '},'));
        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "X"} ]'));
        return itemsJson;
    }

    //회원 탈퇴 하면 가장 먼저 불림
    function withdrawal(address _buyer) public {
        membership.deleteMemberInfo(_buyer);                //회원 관리에서의 정보 삭제
        itemInfo[] storage items = membershipItems[_buyer];
        for( uint i = 0; i<items.length; i++ ){
            uint code = items[i].code;
            itemArray[code].buy = 0;
        }
        delete membershipItems[_buyer];                     //사용자가 구매한 모든 아이템 정보 삭제
        basictoken.withdrawal(_buyer);                      //토큰 원래대로 환수
    }

}


