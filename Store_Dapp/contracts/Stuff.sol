pragma solidity >=0.4.24 <0.6.2;
pragma experimental ABIEncoderV2;
contract Stuff {
    struct stuffInfo{
        uint code;
        string name;
        string description;
        string src;
        uint cost;
        address owner;
        bool isBuy;
    }
    mapping(uint=> stuffInfo) public stuffArray;
    mapping(address=> stuffInfo[]) public personal;
    mapping(address=> string[]) public personalitems;
    uint public num;
    uint public subnum;

    event  StuffInfo(uint code, string name,string description, uint cost, address owner, bool isBuy);
    constructor() public {
        num = 0;
    }

    // Adopting a items
    function buy(address buyer, uint stuffCode, string memory name, string memory src) public returns(bool success) {
        // require(stuffArray[stuffCode].isBuy == false);
        // stuffArray[stuffCode].owner = msg.sender;         //존재 하는지 비교
        // stuffArray[stuffCode].isBuy = true;                   // 물건 구매 했다교 표시
        // personal[buyer].push(stuffArray[stuffCode]); //개인 구매 물건에 추가 
        stuffInfo sutff;
        sutff.code = stuffCode;
        sutff.name = name;
        sutff.src = src;
        sutff.owner = buyer;
        sutff.isBuy = true;
        stuffArray[stuffCode] = sutff;
        personal[buyer].push(stuffArray[stuffCode]);
        
//        string items = uint2str(stuffCode) + "," + name + "," + src + "," + buyer + "," + "1";
        //string sStuffCode = uint2str(stuffCode);
        
        string memory s = string(abi.encodePacked("a", " ", "concatenated", " ", "string"));
        personalitems[buyer].push(s);
        emit StuffInfo(stuffArray[stuffCode].code, stuffArray[stuffCode].name,stuffArray[stuffCode].description, stuffArray[stuffCode].cost, buyer,stuffArray[stuffCode].isBuy);
        return true;
    }
    
    function registerStuff(address _owner, string _name, string _description, uint _cost) public returns(bool success){
        
        // stuffInfo memory tmp= stuffInfo(num,_name,_description,_cost,_owner,false);
        stuffArray[num]=stuffInfo(num,_name,_description,'',_cost,_owner,false);
        num+=1;

        return true;
    }
    
    function deleteStuff(uint _code, address _owner ) public returns(bool success) {
        require(stuffArray[_code].owner ==_owner);
        require(stuffArray[_code].code ==_code);
        delete stuffArray[_code];
        subnum+=1;
        
        return true;
    }
    
    // function getStuff(uint id) public view returns(uint, string , string , uint ,address , bool ){
    //     // stuffInfo memory tmp=stuffArray[id];
    //     return (tmp.code,tmp.name, tmp.description,tmp.cost,tmp.owner,tmp.isBuy);
    // }
    function getStuff(address buyer) public view returns(string[] memory){
        // stuffInfo memory tmp=stuffArray[id];
        string[] storage result = personalitems[buyer];
        return result;
    }    
    function getnum() public view returns( uint,uint){
        return (num, subnum);
    }
    
    function getPersonal(address addr)public view returns(uint){
        return personal[addr].length;
    }
    
    function getPersonalStuff(address addr, uint id) public view returns(uint, string , string , uint ,address , bool ){
        stuffInfo memory tmp=personal[addr][id];
        return (tmp.code,tmp.name, tmp.description,tmp.cost,tmp.owner,tmp.isBuy);
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