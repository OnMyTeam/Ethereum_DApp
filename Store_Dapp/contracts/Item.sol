pragma solidity  ^0.4.24;

import './Personal.sol';
import './BlackList.sol';

contract Item is Owned{
    
    Personal personal;
    BlackList blacklist;
    FixedSupplyToken fixedsupplytoken;
    
    struct ItemInfo{
        uint code;
        uint cost;
        string name;
        string imgsrc;
    }
    mapping(uint=> ItemInfo) public ItemArray;
    mapping(address=> ItemInfo[]) public personalitems;
    uint public index;
    uint public ItemCode;

    event  ItemInfos(uint code, string name,string imgsrc, uint cost);
    event  makeItem(address __fixedTokenAddr, address _blacklistAddr, address _personaladdr);
    constructor(address __fixedTokenAddr, address _blacklistAddr, address _personaladdr) public {
        index = 0;
        ItemCode = 0;
        fixedsupplytoken = FixedSupplyToken(__fixedTokenAddr);
        blacklist = BlackList(_blacklistAddr);
        personal = Personal(_personaladdr);
        emit makeItem(__fixedTokenAddr, _blacklistAddr, _personaladdr);
    }

// Adopting a items
    function itemBuy(address _buyer, uint _index, uint _cost) public returns(bool) {
        blacklist.checkBlacklist(_buyer);
        fixedsupplytoken.SubToken(_buyer, _cost);
        personalitems[_buyer].push(ItemArray[_index]);
        
        emit ItemInfos(ItemArray[_index].code, ItemArray[_index].name,ItemArray[_index].imgsrc, ItemArray[_index].cost);
        return true;
    }
    // owner
    function registerItem(string _name, string _imgsrc, uint _cost) public returns(bool success){
        
        
        ItemArray[index]=ItemInfo(ItemCode,_cost, _name,_imgsrc);
        index = index + 1;
        ItemCode = ItemCode + 1;

        return true;
    }
    function deleteMyItem(address buyer, uint index) public returns(bool success) {

        delete personalitems[buyer][index];
        return true;
    }
    function deleteItem(uint _code) public returns(bool success) {

        delete ItemArray[_code];
        for( uint i=_code; i < index - 1; i++){

            ItemArray[i] = ItemArray[i+1];
        }
        delete ItemArray[index - 1];
        index = index - 1;
        return true;
    }
    function getItems() public view returns(string memory){
        string memory citems;
        for( uint i = 0; i <= index; i++){
            string memory ItemCode = uint2str(ItemArray[i].code);
            string memory cost = uint2str(ItemArray[i].cost);
            string memory imgsrc = ItemArray[i].imgsrc;
            string memory name = ItemArray[i].name;
            string memory id = uint2str(i);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(ItemCode, ",", cost, ",", imgsrc, ",", name, ",", id));
            citems = string(abi.encodePacked(citems, val, "//"));
        }
        return citems;
    } 
    function getMyItems(address buyer) public view returns(string memory){
        ItemInfo[] memory items = personalitems[buyer];
        string memory citems;
        
        for( uint i = 0; i<items.length; i++){
            string memory ItemCode = uint2str(items[i].code);
            string memory cost = uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory id = uint2str(i);
            
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(ItemCode, ",", cost, ",", imgsrc, ",", name, ",", id));
            
            citems = string(abi.encodePacked(citems, val, "//"));
        }
        return citems;
    }    
    function getnum() public view returns( uint){
        return index;
    }
    
    function withdrawal(address _buyer) public {

        delete personalitems[_buyer];
        fixedsupplytoken.withdrawal(_buyer);
        personal.withdrawal(_buyer);
        blacklist.withdrawal(_buyer);
        
    }
    

    function uint2str(uint i) internal pure returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }

}


