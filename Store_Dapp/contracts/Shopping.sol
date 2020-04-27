pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import './Library.sol';
import './Ownable.sol';
import './Membership.sol';
import './Item.sol';

contract Shopping is Ownable {
    using ItemStruct for *;
    using SafeMath for uint;                //overflow, underflow를 막기 위한 safemath library 사용
    using ConvertDataType for uint;

    Membership membership;
    Item item;

    mapping(address=> ItemStruct.itemInfo[]) public membershipItems;       //사용자가 구매한 아이템의 배열로 매핑되어 있는 배열

    event  ItemInfoEvent(uint code, string name, string imgpath, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor(address __membershipAddr, address _itemAddr) public {        //생성한 객체를 contract address로 인스턴스 생성
        membership = Membership(__membershipAddr);
        item = Item(_itemAddr);
    }

    //사용자가 입력한 아이템 코드를 가지는 물건 구매
    function buyItem(uint _itemCode) public returns(bool success) {
        uint8 discountRate;
        uint itemCode;
        uint cost;
        string memory name;
        string memory imgpath;

        uint discountAmount;
        uint discountCost;

        membership.checkBlacklist(msg.sender);                      //사용자가 블랙리스트 인지 확인
        (itemCode, cost, name, imgpath) = item.getItem(_itemCode);//사용자가 구매를 원하는 물건의 가격
        discountRate = uint8(membership.getCashbackRate(msg.sender));       //사용자의 등급의 할인율 계산
        discountAmount = cost.div(100).mul(discountRate);
        discountCost = cost.sub(discountAmount);

        membership.buyItem(msg.sender, cost, discountCost);
        item.setItemBuy(_itemCode, true);
        membershipItems[msg.sender].push(ItemStruct.itemInfo(itemCode, cost, name, imgpath, 1));        //사용자별 구매한 아이템 배열에 구매한 아이템 정보 추가

        emit ItemInfoEvent(itemCode, name, imgpath, cost);
        return true;
    }

    //사용자가 구매한 아이템 삭제
    function deleteMyItem(uint _itemCode) public returns(bool success) {
        uint itemCode = membershipItems[msg.sender][_itemCode].itemCode;
        item.setItemBuy(itemCode, false);
        delete membershipItems[msg.sender][_itemCode];
        return true;
    }

    //사용자가 구매한 물건의 정보 출력
    function getMyAllItems() public view returns(string memory itemsJson) {
        //표현 방식은 getItems 함수 와 동일
        ItemStruct.itemInfo[] storage items = membershipItems[msg.sender];
        itemsJson = '[';

        for( uint i = 0; i<items.length; i++ ){
            ItemStruct.itemInfo memory oneItem = items[i];

            if(keccak256(abi.encodePacked(oneItem.name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }

            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', oneItem.itemCode.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" : ', oneItem.cost.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgpath" : "', oneItem.imgpath, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', oneItem.name, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "id" :', i.uintToStr(), '},'));
        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "9999"} ]'));
        return itemsJson;
    }

    //회원 탈퇴 하면 가장 먼저 불림
    function withdrawal() public {
        ItemStruct.itemInfo[] storage items = membershipItems[msg.sender];
        for( uint i = 0; i<items.length; i++ ){
            uint itemcode = items[i].itemCode;
            item.setItemBuy(itemcode, false);
        }
        membership.withdrawal(msg.sender);
        delete membershipItems[msg.sender];                     //사용자가 구매한 모든 아이템 정보 삭제

    }

    function mig() public pure returns(uint){
        return 1;
    }

}
