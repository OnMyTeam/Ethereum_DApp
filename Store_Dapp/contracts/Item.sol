pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import './Library.sol';
import './Ownable.sol';

library UsingItem{

    struct itemInfo {                        //아이템의 정보를 나타냄
        uint itemcode;                          //물건을 표현하기 위한 유니크한 아이템코드
        uint cost;                          //물건 가격
        string name;                        //물건 이름
        string imgpath;                      //물건 사진 소스
        uint buy;
    }

}

contract Item is Ownable {
    using UsingItem for *;
    using ConvertDataType for uint;

    uint public itemCode;                                       //유니크한 아이템 코드를 만들기 위한 변수
    mapping(uint => UsingItem.itemInfo) public itemInfos;                  //아이템 코드가 아이템 정보로 매핑되어 있는 배열

    event  ItemInfo(uint code, string name,string imgsrc, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor() public {
        itemCode = 0;
    }

    //물건 등록
    function registerItem(string memory _name, string memory _imgsrc, uint _cost) public onlyOwner returns(bool success) {
        itemInfos[itemCode] = UsingItem.itemInfo(itemCode, _cost, _name, _imgsrc, 0);
        itemCode = itemCode + 1;
        return true;
    }

    //아이템 삭제
    function deleteItem(uint _code) public onlyOwner returns(bool success) {
        delete itemInfos[_code];
        return true;
    }

    //등록되어 있는 모든 아이템 출력
    function getItems() public view returns(string memory itemsJson) {
        //등록 되어 있는 모든 아이템 정보를 string으로 표현(JSON 형태로 표현)
        //ex: [{itemCode: 1, cost: 3, imsgsrc:"./phone_1.jpg", name:"samsungphone"}, ...]
        itemsJson = '[';
        for(uint i = 0; i <= itemCode; i++){
            UsingItem.itemInfo memory item = itemInfos[i];

            if(keccak256(abi.encodePacked(item.name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', item.itemcode.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :', item.cost.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "buy" :', item.buy.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgpath" : "', item.imgpath, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', item.name, '"},'));

        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "9999"} ]'));
        return itemsJson;
    }

    function _getItem(uint _index) public view returns (uint itemcode, uint cost, string memory name, string memory imgpath) {
        itemcode = itemInfos[_index].itemcode;
        cost = itemInfos[_index].cost;
        name = itemInfos[_index].name;
        imgpath = itemInfos[_index].imgpath;
    }

    function _setItemBuy(uint _index, string memory _code) public returns (bool success) {
        if(keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked("buy"))) {
            itemInfos[_index].buy = 1;
        } else if(keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked("delete"))) {
            itemInfos[_index].buy = 0;
        }

        return true;
    }

}


