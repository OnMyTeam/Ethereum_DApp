pragma solidity 0.6.4;


interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract OSDCToken is IERC20 {
    
    uint256 _totalSupply;
    uint256 CABalance;
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) public allowence;

    event Transfer(address indexed _from, address indexed _to, uint tokens);
    event Approval(address indexed _tokenOwner, address indexed _spender, uint tokens);

    constructor() public {
        
        symbol = "OSDC";
        name = "osdc Token";
        // totalSupply = 1000000 *10**uint256(decimals);
        _totalSupply = 100000000000;
        CABalance = _totalSupply;
        balances[msg.sender] = CABalance;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256 balance) {
        return balances[tokenOwner];
    }

    function allowance(address tokenOwner, address spender) public override view returns (uint remaining) {
        return allowence[tokenOwner][spender];
    }
    
    function _transfer (address _from, address _to, uint256 _value) internal {
        require(_to != address(0));
        require(balances[_from] >= _value, "need token");
        
        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer (address _to, uint256 _value) public override returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from,address _to, uint256 _value) public override returns (bool success) {
        require(_value <= allowence[_from][msg.sender]);
        allowence[_from][msg.sender] = allowence[_from][msg.sender] - _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve (address _spender, uint256 _value) public override returns (bool success) {
        allowence[msg.sender][_spender] = _value;
        emit Approval (msg.sender, _spender, _value);
        return true;
    }

     function withdrawal(address buyer) external {
        balances[buyer] = 0;
    }


    fallback() external {
        revert();
    }
}