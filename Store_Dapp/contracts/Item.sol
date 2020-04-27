pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import './Library.sol';
import './Ownable.sol';

library ItemStruct{
    struct itemInfo {                        //아이템의 정보를 나타냄
        uint itemCode;                          //물건을 표현하기 위한 유니크한 아이템코드
        uint cost;                          //물건 가격
        string name;                        //물건 이름
        string imgpath;                      //물건 사진 소스
        uint availability;
    }
}

contract Item is Ownable {
    using ItemStruct for *;
    using ConvertDataType for uint;

    uint itemCode;                                       //유니크한 아이템 코드를 만들기 위한 변수
    mapping(uint => ItemStruct.itemInfo) public itemInfos;                  //아이템 코드가 아이템 정보로 매핑되어 있는 배열

    event  ItemInfoEvent(uint code, string name, string imgpath, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor() public {
        itemCode = 0;
    }

    //물건 등록
    function registerItem(string memory _name, string memory _imgpath, uint _cost) public onlyOwner returns (bool success) {
        itemInfos[itemCode] = ItemStruct.itemInfo(itemCode, _cost, _name, _imgpath, 0);
        itemCode = itemCode + 1;
        return true;
    }

    //아이템 삭제
    function deleteItem(uint _itemCode) public onlyOwner returns(bool success) {
        delete itemInfos[_itemCode];
        return true;
    }

    //등록되어 있는 모든 아이템 출력
    function getAllItems() public view returns(string memory itemsJson) {
        //등록 되어 있는 모든 아이템 정보를 string으로 표현(JSON 형태로 표현)
        //ex: [{itemCode: 1, cost: 3, imsgsrc:"./phone_1.jpg", name:"samsungphone"}, ...]
        itemsJson = '[';
        for(uint i = 0; i <= itemCode; i++){
            ItemStruct.itemInfo memory item = itemInfos[i];

            if(keccak256(abi.encodePacked(item.name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', item.itemCode.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :', item.cost.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "buy" :', item.availability.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgpath" : "', item.imgpath, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', item.name, '"},'));
        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "9999"} ]'));
        return itemsJson;
    }

    function getItem(uint _itemCode) external view returns (uint itemcode, uint cost, string memory name, string memory imgpath) {
        itemcode = itemInfos[_itemCode].itemCode;
        cost = itemInfos[_itemCode].cost;
        name = itemInfos[_itemCode].name;
        imgpath = itemInfos[_itemCode].imgpath;
    }

    function setItemBuy(uint _itemCode, bool _isBuy) external returns (bool success) {
        if(_isBuy) {
            itemInfos[_itemCode].availability = 1;
        } else {
            itemInfos[_itemCode].availability = 0;
        }

        return true;
    }

}


