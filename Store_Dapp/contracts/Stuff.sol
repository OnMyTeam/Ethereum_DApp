pragma solidity  >=0.4.24 <0.7.0;
import './Token.sol';
import './Personal.sol';
import './BlackList.sol';

contract Stuff is Owned{
    
    Personal personal;
    BlackList blacklist;
    FixedSupplyToken fixedsupplytoken;
    
    struct stuffInfo{
        uint code;
        uint cost;
        string name;
        string imgsrc;
    }
    mapping(uint=> stuffInfo) public stuffArray;
    mapping(address=> stuffInfo[]) public personalitems;
    uint public index;
    uint public stuffCode;

    event  StuffInfo(uint code, string name,string imgsrc, uint cost);
    event  makeStuff(address __fixedTokenAddr, address _blacklistAddr, address _personaladdr);
    constructor(address __fixedTokenAddr, address _blacklistAddr, address _personaladdr) public {
        index = 0;
        stuffCode = 0;
        fixedsupplytoken = FixedSupplyToken(__fixedTokenAddr);
        blacklist = BlackList(_blacklistAddr);
        personal = Personal(_personaladdr);
        emit makeStuff(__fixedTokenAddr, _blacklistAddr, _personaladdr);
    }

// Adopting a items
    function stuffbuy(address _buyer, uint _index, uint _cost) public returns(bool) {
        blacklist.checkBlacklist(_buyer);
        fixedsupplytoken.SubToken(_buyer, _cost);
        personalitems[_buyer].push(stuffArray[_index]);
        
        emit StuffInfo(stuffArray[_index].code, stuffArray[_index].name,stuffArray[_index].imgsrc, stuffArray[_index].cost);
        return true;
    }
    // owner
    function registerStuff(string _name, string _imgsrc, uint _cost) public returns(bool success){
        
        
        stuffArray[index]=stuffInfo(stuffCode,_cost, _name,_imgsrc);
        index = index + 1;
        stuffCode = stuffCode + 1;

        return true;
    }
    function deleteMyStuff(address buyer, uint index) public returns(bool success) {

        delete personalitems[buyer][index];
        return true;
    }
    function deleteStuff(uint _code) public returns(bool success) {

        delete stuffArray[_code];
        for( uint i=_code; i < index - 1; i++){

            stuffArray[i] = stuffArray[i+1];
        }
        delete stuffArray[index - 1];
        index = index - 1;
        return true;
    }
    function getStuff() public view returns(string memory){
        string memory citems;
        for( uint i = 0; i <= index; i++){
            string memory stuffCode = uint2str(stuffArray[i].code);
            string memory cost = uint2str(stuffArray[i].cost);
            string memory imgsrc = stuffArray[i].imgsrc;
            string memory name = stuffArray[i].name;
            string memory id = uint2str(i);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, ",", cost, ",", imgsrc, ",", name, ",", id));
            citems = string(abi.encodePacked(citems, val, "//"));
        }
        return citems;
    } 
    function getMyStuff(address buyer) public view returns(string memory){
        stuffInfo[] memory items = personalitems[buyer];
        string memory citems;
        
        for( uint i = 0; i<items.length; i++){
            string memory stuffCode = uint2str(items[i].code);
            string memory cost = uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory id = uint2str(i);
            
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, ",", cost, ",", imgsrc, ",", name, ",", id));
            
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


