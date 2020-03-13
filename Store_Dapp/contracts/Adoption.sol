pragma solidity  >=0.4.24 <0.7.0;

contract Adoption {
    address[16] public adopters;
    struct Item { // Struct
        uint stuffCode;
        uint cost;
        string src;
        string title;
    }
    mapping(address=> Item[]) public personalitems;
    // Adopting a pet
    function adopt(address buyer, uint stuffCode, uint cost, string memory src, string memory title) public returns (uint) {
        require(stuffCode >= 0 && stuffCode <= 15);
        // string memory nstuffCode = uint2str(stuffCode);
        // string memory ncost = uint2str(cost);
        // string memory s = string(abi.encodePacked(nstuffCode, "//", ncost, "//", src, "//", title));
        Item storage item;
        item.stuffCode = stuffCode;
        item.cost = cost;
        item.src = src;
        item.title = title;
        personalitems[buyer].push(item);

        return stuffCode;
    }
    // Retrieving the adopters
    function getAdopters(address buyer) public view returns (string memory) {
        Item[] memory items = personalitems[buyer];
        string memory ritems;
        
        for( uint i=0; i<items.length; i++){
            string memory stuffCode = uint2str(items[i].stuffCode);
            string memory cost = uint2str(items[i].cost);
            string memory src = items[i].src;
            string memory title = items[i].title;
            string memory index = uint2str(i);
            if(keccak256(abi.encodePacked(src)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, "//", cost, "//", src, "//", title, "//", index));
            
            ritems = string(abi.encodePacked(ritems, val, ",,,,"));
        }

        return ritems;

    }
    function deleteAdopter(address buyer, uint index) public {
        // Item[] memory items = personalitems[buyer];
        // items[index].stuffCode=99999;
        // items[index].cost=99999;
        // items[index].src="xxxx";
        // items[index].title="xxx";
        delete personalitems[buyer][index];
        
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