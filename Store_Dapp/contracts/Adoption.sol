pragma solidity  >=0.4.24 <0.7.0;
pragma experimental ABIEncoderV2;
contract Adoption {
    address[16] public adopters;
    struct Item { // Struct
        uint cost;
        bytes name;
    }
    mapping(address=> string[]) public personalitems;
    // Adopting a pet
    function adopt(address buyer, uint stuffCode, uint cost, string src, string title) public returns (uint) {
        require(stuffCode >= 0 && stuffCode <= 15);
        string memory nstuffCode = uint2str(stuffCode);
        string memory ncost = uint2str(cost);
        string memory s = string(abi.encodePacked(nstuffCode, "//", ncost, "//", src, "//", title));
        
        personalitems[buyer].push(s);

        return stuffCode;
    }
    // Retrieving the adopters
    function getAdopters(address buyer) public view returns (string memory) {
        string[] memory items = personalitems[buyer];
        string memory ritems;
        
        for( uint i=0; i<items.length; i++){
            string memory index = uint2str(i);
            ritems = string(abi.encodePacked(ritems,items[i],"//", index, ",,,,"));
        }

        return ritems;

    }
    function deleteAdopter(address buyer, uint index) public {
        string[] memory items = personalitems[buyer];
        delete items[index];
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