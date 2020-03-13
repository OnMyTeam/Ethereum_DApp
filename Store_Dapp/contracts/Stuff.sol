pragma solidity  >=0.4.24 <0.7.0;

contract Stuff {
    struct stuffInfo{
        uint code;
        string name;
        string imgsrc;
        uint cost;

    }
    mapping(uint=> stuffInfo) public stuffArray;
    //mapping(address=> stuffInfo[]) public personal;
    mapping(address=> stuffInfo[]) public personalitems;
    uint public num;
    uint public subnum;

    event  StuffInfo(uint code, string name,string imgsrc, uint cost);
    constructor() public {
        num = 0;
    }

    // Adopting a itemss
    function stuffbuy(address buyer, uint stuffCode, string memory name, string memory src, uint cost) public returns(bool success) {
        
        stuffInfo storage stuff;
        stuff.code = stuffCode;
        stuff.name = name;
        stuff.imgsrc = src;
        stuff.cost = cost;
        
        stuffArray[num] = stuff;
       
        
        
        //personalitems[buyer].push(stuffArray[stuffCode]); //개인 구매 물건에 추가
        personalitems[buyer].push(stuffArray[num]); //개인 구매 물건에 추가 
        num += 1;
    
 
        //emit StuffInfo(stuffArray[_stuffCode].code, stuffArray[_stuffCode].name,stuffArray[_stuffCode].imgsrc, stuffArray[_stuffCode].cost);
        return true;
    }
    // owner
    function registerStuff(address _owner, string _name, string _imgsrc, uint _cost) public returns(bool success){
        
        
        stuffArray[num]=stuffInfo(num,_name,_imgsrc,_cost);
        num+=1;

        return true;
    }
    
    function deleteStuff(uint _code, address _owner ) public returns(bool success) {

        delete stuffArray[_code];
        subnum+=1;
        
        return true;
    }
    
    // function getStuff(uint id) public view returns(uint, string , string , uint ,address , bool ){
    //     // stuffInfo memory tmp=stuffArray[id];
    //     return (tmp.code,tmp.name, tmp.description,tmp.cost,tmp.owner,tmp.isBuy);
    // }
    function getStuff(address buyer) public view returns(string memory){
        stuffInfo[] memory items = personalitems[buyer];
        string memory citems;
        
        for( uint i=0; i<items.length; i++){
            string memory stuffCode = uint2str(items[i].code);
            string memory cost = uint2str(items[i].cost);
            string memory imgsrc = items[i].imgsrc;
            string memory name = items[i].name;
            string memory index = uint2str(i);
            if(keccak256(abi.encodePacked(imgsrc)) == keccak256(abi.encodePacked(""))){
                continue;
            }
            string memory val = string(abi.encodePacked(stuffCode, "//", cost, "//", imgsrc, "//", name, "//", index));
            
            citems = string(abi.encodePacked(citems, val, ",,,,"));
        }
        return citems;
    }    
    function getnum() public view returns( uint,uint){
        return (num, subnum);
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