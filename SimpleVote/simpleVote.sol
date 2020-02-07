pragma solidity ^0.6.2;

contract simpleVote {
    
    struct voter {
        address voterAddress;
        uint tokenBought;
    }
    
    mapping (address => voter) public voters; // 투표자들의 주소
    mapping (bytes32 => uint) public votesReceived; // 후보자 득표 수
    
    bytes32[] public candidateNames; // 후보자 배열
    
    uint public totalToken; // 토큰 총 개수
    uint public balanceTokens; // 남은 토큰 수
    uint public tokenPrice; // 토큰 가격 ex) 0.01 ether
    

    // ----------------------------------------------------------------------------
    // contract deploy시,  
    // 1. token 생성 및 변환 비율 설정
    // 2. 후보자 생성 
    // ----------------------------------------------------------------------------
    constructor(uint _totalToken, uint _tokenPrice) public // Tx 생성시 호출자
    {
        totalToken = _totalToken;
        balanceTokens = _totalToken;
        tokenPrice = _tokenPrice;
        
        candidateNames.push("Pizza");
        candidateNames.push("Hamburger");
        candidateNames.push("Fries");
        candidateNames.push("Spagetti");
        candidateNames.push("BBQ");
        candidateNames.push("Sandwich");
        candidateNames.push("Gimbap");
    }
    
    // ----------------------------------------------------------------------------
    // buy() : Eth-> token 으로 변환
    // 1. msg.value는 token 으로 변환 할 이더
    // 2. balanceToken(변환 가능한 토큰의 양)이 바꾸려고 하는 양(TokensToBuy)보다 큰지 검사
    // 3. 변환된 토큰을 voters 배열에 msg.sender의 매핑된 배열에 추가
    // ----------------------------------------------------------------------------
    function buy() payable public returns (int) 
    {
        uint tokensToBuy = msg.value / tokenPrice;
        require(tokensToBuy <= balanceTokens);
        voters[msg.sender].voterAddress = msg.sender;
        voters[msg.sender].tokenBought += tokensToBuy;
        balanceTokens -= tokensToBuy;
    }
    
    // ----------------------------------------------------------------------------
    // getVotesReceivedFor() : 각 후보자 별 투표 수 return 
    // 1. 후보자 -> 득표 수 로 매핑된 votesReceived 배열에서 각 후보자 별 득표수 반환  
    // ----------------------------------------------------------------------------
    function getVotesReceivedFor() view public returns (uint, uint, uint, uint, uint, uint, uint)
    {
        return (votesReceived["Pizza"],
        votesReceived["Hamburger"],
        votesReceived["Fries"],
        votesReceived["Thursday"],
        votesReceived["Spagetti"],
        votesReceived["BBQ"],
        votesReceived["Gimbap"]);
    }

    // ----------------------------------------------------------------------------
    // vote() : 입력받은 CandidateName에 득표수 TokenCountForVote 만큼 추가
    // 1. 입력받은 후보자 이름으로 index 구함 -> 해당 후보자가 존재하는지 확인 
    // 2. 투표하려는 자(msg.sender)가 보유한 토큰> TokenCountFor 인지 확인 
    // 3. 득표수 추가, msg.sender가 보유한 토큰 감소  
    // ----------------------------------------------------------------------------
    function vote(bytes32 candidateName, uint tokenCountForVote) public
    {
        uint index = getCandidateIndex(candidateName);
        require(index != uint(-1));
        
        require(tokenCountForVote <= voters[msg.sender].tokenBought);
        
        votesReceived[candidateName] += tokenCountForVote;
        voters[msg.sender].tokenBought -= tokenCountForVote;
    }
    
    // ----------------------------------------------------------------------------
    // getCandidateIndex(): 입력받은 CandidateName의 index 반환 
    // 1. 입력한 이름의 후보자가 존재하는지 확인하기 위함.
    // ----------------------------------------------------------------------------
    function getCandidateIndex(bytes32 candidate) view public returns (uint) // 해당 후보자의 index 반환
    {
        for(uint i=0; i < candidateNames.length; i++)
        {
            if(candidateNames[i] == candidate)
            {
                return i;
            }
        }
        
        return uint(-1); // 후보자가 없는 경우 -1 반환
    }
    
    // ----------------------------------------------------------------------------
    // getCandidateInfo(): 후보자의 이름을 배열로 반환
    // ----------------------------------------------------------------------------
    function getCandidatesInfo() view public returns ( bytes32[] memory )
    {
        return candidateNames;
    }
    // ----------------------------------------------------------------------------
    // getTotalToken(): 발행한 총 토큰의 개수 반환 
    // ----------------------------------------------------------------------------
    function getTotalToken() view public returns(uint)
    {
        return totalToken;
    }

    // ----------------------------------------------------------------------------
    // getBalanceToken(): Eth-> 토큰 교환 가능한 수 반환 
    // ----------------------------------------------------------------------------
    function getBalanceTokens() view public returns(uint)
    {
        return balanceTokens;
    }

    // ----------------------------------------------------------------------------
    // getTokenPrice(): 토큰 변화나 비율 반환  
    // ----------------------------------------------------------------------------
    function getTokenPrice() view public returns(uint)
    {
        return tokenPrice;
    }

    // ----------------------------------------------------------------------------
    // getTokenPrice(): msg.sender 소유 토큰 개수 반환   
    // ----------------------------------------------------------------------------
    function getTokenBought() view public returns(uint)
    {
        return voters[msg.sender].tokenBought;
    }

    // ----------------------------------------------------------------------------
    // fallback(): contract에 속해 있지 않은 function 부를 때 예외 처리   
    // ----------------------------------------------------------------------------
    fallback() external payable{
        revert();
    }
}