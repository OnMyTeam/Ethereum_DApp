pragma solidity  >=0.4.24 <0.7.0;

// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}
contract Stuff is Owned{
    struct stuffInfo{
        uint code;
        uint cost;
        string name;
        string imgsrc;
    }
    mapping(uint=> stuffInfo) public stuffArray;
    //mapping(address=> stuffInfo[]) public personal;
    mapping(address=> stuffInfo[]) public personalitems;
    uint public num;
    // uint public subnum;

    event  StuffInfo(uint code, string name,string imgsrc, uint cost);
    constructor() public {
        num = 9;
    }

    // Adopting a itemss
    function stuffbuy(address _buyer, uint _stuffCode, string memory _name, string memory _src, uint _cost) public returns(bool success ) {
        

        if(_stuffCode <=8){ 
            stuffArray[_stuffCode]=stuffInfo(_stuffCode,_cost,_name,_src);
        }

        personalitems[_buyer].push(stuffArray[_stuffCode]);
        
        // emit StuffInfo(stuffArray[_stuffCode].code, stuffArray[_stuffCode].name,stuffArray[_stuffCode].imgsrc, stuffArray[_stuffCode].cost);
        return true;
    }
    // owner
    function registerStuff(string _name, string _imgsrc, uint _cost) public returns(bool success){
        
        
        stuffArray[num]=stuffInfo(num,_cost,_name,_imgsrc);
        num = num + 1;

        return true;
    }
    function deleteMyStuff(address buyer, uint index) public returns(bool success) {

        delete personalitems[buyer][index];
        return true;
    }
    function deleteStuff(uint _code) public returns(bool success) {

        delete stuffArray[_code];
        num -= 1;
        return true;
    }
    function getStuff() public view returns(string memory){
        string memory citems;
        for( uint i=9; i <= num; i++){
            string memory stuffCode = uint2str(stuffArray[i].code);
            string memory cost = uint2str(stuffArray[i].cost);
            string memory imgsrc = stuffArray[i].imgsrc;
            string memory name = stuffArray[i].name;
            string memory index = uint2str(i);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, ",", cost, ",", imgsrc, ",", name, ",", index));
            citems = string(abi.encodePacked(citems, val, "//"));
        }
        return citems;
    } 
    function getMyStuff(address buyer) public view returns(string memory){
        stuffInfo[] memory items = personalitems[buyer];
        string memory citems;
        
        for( uint i=0; i<items.length; i++){
            string memory stuffCode = uint2str(items[i].code);
            string memory cost = uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory index = uint2str(i);
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, ",", cost, ",", imgsrc, ",", name, ",", index));
            
            citems = string(abi.encodePacked(citems, val, "//"));
        }
        return citems;
    }    
    function getnum() public view returns( uint){
        return num;
    }
    
    // function getPersonal(address addr)public view returns(uint){
    //     return personal[addr].length;
    // }
    
    // function getPersonalStuff(address addr, uint id) public view returns(uint, string , string , uint ,address , bool ){
    //     stuffInfo memory tmp=personal[addr][id];
    //     return (tmp.code,tmp.name, tmp.description,tmp.cost,tmp.owner,tmp.isBuy);
    // }
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


