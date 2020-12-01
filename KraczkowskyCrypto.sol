pragma solidity ^0.6.4;

contract KraczkowskyToken{
  string public name = "Kraczkowsky Token";
  string public symbol = "KRZ";
  string public standard = "Kraczkowsky Token v1.0";
  uint256 public totalSupply;
// Store the balance of each account that owns tokens using an address as a key and uint as value
  mapping(address => uint256) public balanceOf;
// See how much the account is allowed to spend using an address as key + second address as value that maps to a uint
  mapping(address => mapping(address => uint256)) public allowance;
// Emit event when a transfer is made
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );
// Emit event when a spend has been approved
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 _value
  );

  constructor (uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }
// implement a transfer function (per standard) to allow users to send tokens to another account
  function transfer(address _to, uint256 _value) public returns (bool success){
    require(
      balanceOf[msg.sender] >= _value,
      'ERROR (transfer): You do not have enough KRZ tokens to completes this transaction!'
    );

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }
// implement an approve function (per standard) that allows another account to spend tokens, like on a cryptocurrency exchange.
  function approve(address _spender, uint256 _value) public returns (bool success){
    allowance[msg.sender][_spender] = _value;

    emit Approval(msg.sender, _spender, _value);

    return true;
  }
// implement a transferFrom function (per standard) to establish a withdraw workflow, allowing contracts to transfer tokens on your behalf.
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    require(
      _value <= balanceOf[_from],
      "Balance of sending account has insufficient funds for this transfer!"
    );
    require(
      _value <= allowance[_from][msg.sender],
      "Error"
    );

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from];

    emit Transfer(_from, _to, _value);

    return true;
  }
}


contract KraczkowskyMarketplace {
// Consumers should be able to exchange
  KraczkowskyToken public tokenContract;

  constructor (KraczkowskyToken _tokenContract) public {
    tokenContract = _tokenContract;
  }
// Sender transfers gift amount to gift provider
  function purchaseGift (address _giftProvider, uint256 _giftAmount) public {
    require(
      tokenContract.balanceOf(msg.sender) >= _giftAmount,
      'ERROR (purchaseGift): You do not have enough KRZ tokens to completes this transaction!'
    );
    require(tokenContract.transfer(_giftProvider, _giftAmount));
  }
}
