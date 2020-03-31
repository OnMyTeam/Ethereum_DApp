pragma solidity >=0.4.21 <0.7.0;

import './Personal.sol';
import './Ownable.sol';

contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract OSDCToken is ERC20Interface, Ownable {
    Personal personal;
    uint public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    mapping(address => uint256) public balaceOf;
    mapping(address => mapping(address => uint256)) public allowence;

    event Transfer(address indexed _from, address indexed _to, uint tokens);
    event Approval(address indexed _tokenOwner, address indexed _spender, uint tokens);
    event Burm ( address indexed from, uint256 value);

    constructor(address _personalAdd) public {
        personal = Personal(_personalAdd);
        symbol = "OSDC";
        name = "osdc Token";
        // totalSupply = 1000000 *10**uint256(decimals);
        totalSupply = 10000000000;
        balaceOf[msg.sender] = totalSupply;
    }

    // 아무데서도 부르지 않음 
    function totalSupply() public view returns (uint){      
        return totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint balance){
        return balaceOf[tokenOwner];
    }

    // 아무데도 쓰이지 않음 
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {  
        return allowence[tokenOwner][spender];
    }
    
    function _transfer (address _from, address _to, uint256 _value) internal {
        require(_to != 0x0);
        require(balaceOf[_from]>=_value);
        require(balaceOf[_to] + _value >= balaceOf[_to]);
        balaceOf[_from] -= _value;
        balaceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer (address _to, uint256 _value) public returns (bool success){
        _transfer(msg.sender,_to,_value);
        return true;
    }

    // 아무데서도 쓰이지 않음 
    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success){      
        require(_value <= allowence[_from][msg.sender]);
        allowence[_from][msg.sender] -= _value;
        _transfer(_from,_to,_value);
        return true;
    }

    // 아무데서도 쓰이지 않음 
    function approve (address _spender, uint256 _value) public returns (bool success) {
        allowence[msg.sender][_spender] = _value;
        emit Approval (msg.sender,_spender,_value);
        return true;
    }

    // 아무데서도 쓰이지 않음
    function mintToken (address _target, uint256 _mintedAmount) public onlyOwner {
        balaceOf[_target] += _mintedAmount;
        totalSupply += _mintedAmount;
        emit Transfer(0, owner, _mintedAmount);
        emit Transfer(owner, _target, _mintedAmount);
    }

    //아무데서도 쓰이지 않음 
    function burn(uint256 _value) public onlyOwner returns (bool success){
        require(balaceOf[msg.sender] >= _value);
        balaceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burm(msg.sender,_value);

        return true;
    }

    function() public payable {
        uint256 amount = msg.value;
        require (balaceOf[owner] >= amount);

        balaceOf[owner] = balaceOf[owner] - amount;
        balaceOf[msg.sender] = balaceOf[msg.sender] + amount;

        owner.transfer(msg.value);
        emit Transfer(owner, msg.sender, amount);
    }

    // 아무데서도 쓰이지 않음 
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }

    function SubToken(address buyer, uint tokens) public {
        require (tokens <= balaceOf[buyer], "need token");
        personal.updateHistory(buyer, tokens);
        uint8 rate = uint8(personal.getCashbackRate(buyer));
        uint cashBack = tokens / 100 * rate;
        uint ntokens = tokens - cashBack;
        balaceOf[buyer] -= ntokens;
    }

    function withdrawal(address buyer) public {
        balaceOf[buyer] = 0;
    }
}