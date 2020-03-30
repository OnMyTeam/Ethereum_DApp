pragma solidity >=0.4.21 <0.7.0;
import './Ownable.sol';
import './Personal.sol';
import './Token.sol';

contract Item is Ownable{
    
    Personal personal;
    OSDCToken basictoken;
    
    struct ItemInfo{
        uint code;
        uint cost;
        string name;
        string imgsrc;
    }
    mapping(uint=> ItemInfo) public itemArray;
    mapping(address=> ItemInfo[]) public personalItems;
    uint public index;
    uint public itemCode;

    event  ItemInfos(uint code, string name,string imgsrc, uint cost);
    event  makeItem(address __basictokenAddr, address _personalAddr);
    constructor(address __basictokenAddr, address _personalAddr) public {
        index = 0;
        itemCode = 0;
        basictoken = OSDCToken(__basictokenAddr);
        personal = Personal(_personalAddr);
        emit makeItem(__basictokenAddr, _personalAddr);
    }

    // Adopting a items
    function itemBuy(address _buyer, uint _index, uint _cost) public returns(bool) {
        personal.checkBlackList(_buyer);
        basictoken.SubToken(_buyer, _cost);
        personalItems[_buyer].push(itemArray[_index]);
        
        emit ItemInfos(itemArray[_index].code, itemArray[_index].name,itemArray[_index].imgsrc, itemArray[_index].cost);
        return true;
    }
    // owner
    function registerItem(string _name, string _imgsrc, uint _cost) public returns(bool success){
        
        
        itemArray[index]=ItemInfo(itemCode,_cost, _name,_imgsrc);
        index = index + 1;
        itemCode = itemCode + 1;

        return true;
    }
    function deleteMyItem(address buyer, uint index) public returns(bool success) {

        delete personalItems[buyer][index];
        return true;
    }
    function deleteItem(uint _code) public returns(bool success) {

        delete itemArray[_code];
        for( uint i=_code; i < index - 1; i++){

            itemArray[i] = itemArray[i+1];
        }
        delete itemArray[index - 1];
        index = index - 1;
        return true;
    }
    function getItems() public view returns(string memory){

        string memory itemsJson = '[';
        for( uint i = 0; i <= index; i++){
            string memory itemCode = uint2str(itemArray[i].code);
            string memory cost = uint2str(itemArray[i].cost);
            string memory imgsrc = itemArray[i].imgsrc;
            string memory name = itemArray[i].name;
            string memory id = uint2str(i);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ',itemCode, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" :',cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgsrc" : "',imgsrc, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "',name, '",'));
            if(i == index - 1){
                itemsJson = string(abi.encodePacked(itemsJson, ' "id" :',id, '}'));    
            
            }else{
                itemsJson = string(abi.encodePacked(itemsJson, ' "id" :',id, '},'));    
            }
            
        }
        itemsJson = string(abi.encodePacked(itemsJson, ']'));
        return itemsJson;
    } 
    function getMyItems(address buyer) public view returns(string memory){
        ItemInfo[] storage items = personalItems[buyer];
        string memory itemsJson = '[';
        
        for( uint i = 0; i<items.length; i++){
            string memory itemCode = uint2str(items[i].code);
            string memory cost = uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory id = uint2str(i);
            
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            
            itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : ', itemCode, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "cost" : ', cost, ','));
            itemsJson = string(abi.encodePacked(itemsJson, ' "imgsrc" : "', imgsrc, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "name" : "', name, '",'));
            itemsJson = string(abi.encodePacked(itemsJson, ' "id" :', id, '},'));

        }
        itemsJson = string(abi.encodePacked(itemsJson, '{ "itemCode" : "X"}'));
   
        itemsJson = string(abi.encodePacked(itemsJson, ']'));
        return itemsJson;
    }    
    function getnum() public view returns( uint){
        return index;
    }
    
    function withdrawal(address _buyer) public {
        delete personalItems[_buyer];
        personal.withdrawal(_buyer);
        basictoken.withdrawal(_buyer);
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


