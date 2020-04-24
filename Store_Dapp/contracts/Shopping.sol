pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import './Library.sol';
import './Ownable.sol';
import './Membership.sol';
import './Item.sol';

contract Shopping is Ownable {
    using SafeMath for uint;                //overflow, underflow를 막기 위한 safemath library 사용
    using UsingItem for *;
    using ConvertDataType for uint;

    Membership membership;
    Item item;

    mapping(address=> UsingItem.itemInfo[]) public membershipItems;       //사용자가 구매한 아이템의 배열로 매핑되어 있는 배열

    event  ItemInfo(uint code, string name, string imgpath, uint cost);       //아이템 정보를 출력하기 위한 이벤트

    constructor(address payable __membershipAddr, address payable _itemAddr) public {        //생성한 객체를 contract address로 인스턴스 생성
        membership = Membership(__membershipAddr);
        item = Item(_itemAddr);
    }

    //사용자가 입력한 아이템 코드를 가지는 물건 구매
    function buyItem(address _buyer, uint _index) public returns(bool success) {
        uint8 rate;
        uint itemcode;
        uint cost;
        string memory name;
        string memory imgpath;

        uint payback;
        uint discountCost;

        membership.checkBlacklist(_buyer);                      //사용자가 블랙리스트 인지 확인
        (itemcode, cost, name, imgpath) = item._getItem(_index);//사용자가 구매를 원하는 물건의 가격
        rate = uint8(membership.getCashbackRate(_buyer));       //사용자의 등급의 할인율 계산
        payback = cost.div(100).mul(rate);
        discountCost = cost.sub(payback);

        membership._buyItem(_buyer,cost,discountCost);
        item._setItemBuy(_index, "buy");
        membershipItems[_buyer].push(UsingItem.itemInfo(itemcode, cost, name, imgpath,1));        //사용자별 구매한 아이템 배열에 구매한 아이템 정보 추가

        emit ItemInfo(itemcode, name, imgpath, cost);
        return true;
    }

    //사용자가 구매한 아이템 삭제
    function deleteMyItem(address _buyer, uint _index) public returns(bool success) {
        uint itemcode = membershipItems[_buyer][_index].itemcode;
        item._setItemBuy(itemcode, "delete");
        delete membershipItems[_buyer][_index];
        return true;
    }

    //사용자가 구매한 물건의 정보 출력
    function getMyItems(address _buyer) public view returns(string memory itemsJson) {
        //표현 방식은 getItems 함수 와 동일
        UsingItem.itemInfo[] storage items = membershipItems[_buyer];
        itemsJson = '[';

        for( uint i = 0; i<items.length; i++ ){
            UsingItem.itemInfo memory oneItem = items[i];

            if(keccak256(abi.encodePacked(oneItem.name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }

            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', oneItem.itemcode.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" : ', oneItem.cost.uintToStr(), ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgpath" : "', oneItem.imgpath, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', oneItem.name, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "id" :', i.uintToStr(), '},'));
        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "9999"} ]'));
        return itemsJson;
    }

    //회원 탈퇴 하면 가장 먼저 불림
    function withdrawal(address _buyer) public {
        UsingItem.itemInfo[] storage items = membershipItems[_buyer];
        for( uint i = 0; i<items.length; i++ ){
            uint itemcode = items[i].itemcode;
            item._setItemBuy(itemcode, "delete");
        }
        membership._withdrawal(_buyer);
        delete membershipItems[_buyer];                     //사용자가 구매한 모든 아이템 정보 삭제

    }

}
