## XCHNG-Solidity Mini Project  

Congratulations on participating in the XCHNG-Solidity mini project! You will be building a solidity contract to buy and sell cars using a standard ERC20 token.

### Instructions

The overall goal is to create a simple contract that can `register` cars, `list` cars for sale, and `buy` cars. 

Solidity and Javascript are the required languages for this project. 

The project must compile and come with a set of run instructions.

We expect that you do this independently and without using existing code, other than the ERC20 standard interface.

You should use the `Truffle` framework to develop the contract and be able to deploy and interact with the contract on `Ganache`.  
See Truffle documentation for addional information: http://truffleframework.com/docs/getting_started/project

You should provide a simple webpage to connect to the contract and perform the functions.

Tasks include:
- Implement the CarExchangeInterface 
- Implement a ERC-20 Token used to buy cars on the exchange 
- Deploy to local ganache instance using Truffle 
- Supply instructions on how to compile, run, test and debug your project 
- Using Web3 show how a car can be registered, listed and bought

**NOTE**: Do not deploy this contract to the Ethereum Mainnet or Testnet!

### Project overview

Write a solidity contract that fully implements the following interface:  

```
contract CarExchangeInterface {
    // register a car
    function register(address _owner, uint _vinNumber ) public returns (bool success);
    // buy a car by _vinNumber that is listed for sale 
    function buy(uint _vinNumber, uint _value) public returns (bool success);
    // list a car for sale by _vinNumber 
    function list(uint _vinNumber, uint _value) public returns (bool success); 
    // ownedCars display a list of cars belonging to an owner   
    function ownedCars( address _owner) external view returns (uint[] vinNumbers);  

    event Registered(uint indexed _vinNumber, address indexed _owner);
    event Bought(uint indexed _vinNumber, address indexed _oldOwner, address indexed _newOwner, uint _value);
    event Listed(uint indexed _vinNumber, address indexed _carOwner, uint _value);
}
```

Value should be a number of ERC20 tokens used for buying and selling cars.

The contract should : 
- Keep track of all cars and the address associated with the owner
- Keep track of which cars are listed for sale 
- Allow cars to be bought for an exact amount of provided tokens (defined in the ERC-20 Token) 
- Have the ability to display what cars belong to a given address

The contract should be able to be compiled and deployed to ganache locally.

Create a simple webpage using HTML and Javascript to interact with the contract and perform each of the required functions.

### Bonus (not required)
- Unit tests written in Javascript, and run using Truffle's automated testing framework.
- Safety checks around ownership
    - we should not be able to list a car for sale if we don't own it 
- Use SafeMath
- Additional, useful, functions on the contract
- Clear documentation 
- Clean vcs history 
