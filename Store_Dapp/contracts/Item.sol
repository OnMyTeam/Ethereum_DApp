pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;
import './libray.sol';
import './Ownable.sol';

contract Item is Ownable{
    using SafeMath for uint;                //overflow, underflow를 막기 위한 safemath library 사용


    struct itemInfo{                        //아이템의 정보를 나타냄
        uint itemcode;                          //물건을 표현하기 위한 유니크한 아이템코드
        uint cost;                          //물건 가격
        string name;                        //물건 이름 
        string imgpath;                      //물건 사진 소스
        uint8 buy;
    }
    mapping(uint => itemInfo) public itemInfos;                  //아이템 코드가 아이템 정보로 매핑되어 있는 배열
    uint public itemCode;                                       //유니크한 아이템 코드를 만들기 위한 변수
    event  ItemInfo(uint code, string name,string imgsrc, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor() public {
        itemCode = 0;
    }

    //물건 등록
    function registerItem(string memory _name, string memory _imgsrc, uint _cost) public onlyOwner returns(bool success) {
        itemInfos[itemCode] = itemInfo(itemCode, _cost, _name, _imgsrc, 0);
        itemCode = itemCode + 1;
        return true;
    }



    //아이템 삭제
    function deleteItem(uint _code) public onlyOwner returns(bool success) {
        delete itemInfos[_code];
        return true;
    }


    //등록되어 있는 모든 아이템 출력
    function getItems() public view returns(string memory itemsJson){
        //등록 되어 있는 모든 아이템 정보를 string으로 표현(JSON 형태로 표현)
        //ex: [{itemCode: 1, cost: 3, imsgsrc:"./phone_1.jpg", name:"samsungphone"}, ...]
        itemsJson = '[';
        for(uint i = 0; i <= itemCode; i++){
            string memory itemcode = ConvertDataType.uintToStr(itemInfos[i].itemcode);
            string memory cost = ConvertDataType.uintToStr(itemInfos[i].cost);
            string memory imgpath = itemInfos[i].imgpath;
            string memory name = itemInfos[i].name;
            string memory buy = ConvertDataType.uintToStr(itemInfos[i].buy);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', itemcode, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :', cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "buy" :', buy, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgpath" : "', imgpath, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', name, '"},'));

        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "9999"} ]'));
        return itemsJson;
    }


}


