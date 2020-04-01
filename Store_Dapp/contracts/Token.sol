pragma solidity >=0.4.21 <0.7.0;
import './libray.sol';
import './Membership.sol';
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
    using SafeMath for uint;
    Membership membership;
    uint public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    mapping(address => uint256) public balaceOf;
    mapping(address => mapping(address => uint256)) public allowence;

    event Transfer(address indexed _from, address indexed _to, uint tokens);
    event Approval(address indexed _tokenOwner, address indexed _spender, uint tokens);

    constructor(address _membershipAdd) public {
        membership = Membership(_membershipAdd);
        symbol = "OSDC";
        name = "osdc Token";
        // totalSupply = 1000000 *10**uint256(decimals);
        totalSupply = 10000000000;
        balaceOf[msg.sender] = totalSupply;
    }

    function totalSupply() public view returns (uint) {
        return totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balaceOf[tokenOwner];
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowence[tokenOwner][spender];
    }
    
    function _transfer (address _from, address _to, uint256 _value) internal {
        require(_to != 0x0);
        require(balaceOf[_from] >= _value, "need token");
        
        balaceOf[_from] = balaceOf[_from].sub(_value);
        balaceOf[_to] = balaceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    function transfer (address _to, uint256 _value) public returns (bool success) {
        _transfer(tx.origin, _to, _value);
        return true;
    }

    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowence[_from][msg.sender]);
        allowence[_from][msg.sender] = allowence[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }

    function approve (address _spender, uint256 _value) public returns (bool success) {
        allowence[msg.sender][_spender] = _value;
        emit Approval (msg.sender, _spender, _value);
        return true;
    }

    function() public payable {
        uint256 amount = msg.value;
        require (balaceOf[owner] >= amount);
        balaceOf[owner] = balaceOf[owner].sub(amount);
        balaceOf[msg.sender] = balaceOf[msg.sender].add(amount);

        owner.transfer(msg.value);
        emit Transfer(owner, msg.sender, amount);
    }


    function withdrawal(address buyer) public {
        balaceOf[buyer] = 0;
    }
}