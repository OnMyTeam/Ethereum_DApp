pragma solidity >=0.4.21 <0.7.0;
import './libray.sol';
import './Ownable.sol';
import './Membership.sol';
import './Token.sol';

contract Item is Ownable{
    using SafeMath for uint;
    Membership membership;
    OSDCToken basictoken;

    struct itemInfo{
        uint code;
        uint cost;
        string name;
        string imgsrc;
    }
    mapping(uint=> itemInfo) public itemArray;
    mapping(address=> itemInfo[]) public membershipItems;
    uint public itemCode;

    event  ItemInfo(uint code, string name,string imgsrc, uint cost);
    event  MakeItem(address __basictokenAddr, address _membershipAddr);

    constructor(address __basictokenAddr, address _membershipAddr) public {
        itemCode = 0;
        basictoken = OSDCToken(__basictokenAddr);
        membership = Membership(_membershipAddr);
        emit MakeItem(__basictokenAddr, _membershipAddr);
    }

    function registerItem(string _name, string _imgsrc, uint _cost) public onlyOwner returns(bool success) {
        itemArray[itemCode] = itemInfo(itemCode, _cost, _name, _imgsrc);
        itemCode = itemCode + 1;
        return true;
    }

    function buyItem(address _buyer, uint _index) public returns(bool success) {
        uint8 rate;
        uint cost;
        uint cashBack;
        uint ntokens;

        membership.checkBlacklist(_buyer);
        cost = itemArray[_index].cost;
        rate = uint8(membership.getCashbackRate(_buyer));
        cashBack = cost / 100 * rate;
        ntokens = cost.sub(cashBack);
        basictoken.transfer(owner, ntokens);

        membership.updateHistory(_buyer, cost);
        membershipItems[_buyer].push(itemArray[_index]);

        emit ItemInfo(itemArray[_index].code, itemArray[_index].name,itemArray[_index].imgsrc, itemArray[_index].cost);
        return true;
    }

    function deleteItem(uint _code) public onlyOwner returns(bool success) {
        delete itemArray[_code];
        return true;
    }

    function deleteMyItem(address _buyer, uint _index) public returns(bool success) {
        delete membershipItems[_buyer][_index];
        return true;
    }

    function getItems() public view returns(string memory itemsJson){
        itemsJson = '[';
        for(uint i = 0; i <= itemCode; i++){
            string memory code = ChangeType.uint2str(itemArray[i].code);
            string memory cost = ChangeType.uint2str(itemArray[i].cost);
            string memory imgsrc = itemArray[i].imgsrc;
            string memory name = itemArray[i].name;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))) {
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', code, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :', cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgsrc" : "', imgsrc, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', name, '"},'));

        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "X"} ]'));
        return itemsJson;
    }

    function getMyItems(address buyer) public view returns(string memory itemsJson) {
        itemInfo[] storage items = membershipItems[buyer];
        itemsJson = '[';

        for( uint i = 0; i<items.length; i++ ){
            string memory code = ChangeType.uint2str(items[i].code);
            string memory cost = ChangeType.uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory id = ChangeType.uint2str(i);

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
    function withdrawal(address _buyer) public {
        membership.deleteMemberInfo(_buyer);
        delete membershipItems[_buyer];
        basictoken.withdrawal(_buyer);
    }

}


