pragma solidity ^0.4.24;

import './Ownable.sol';

contract CarExchange is Ownable {

  // We emit this event whenever a car is newly registered to the blockchain
  event Registered(uint indexed _vinNumber, address indexed _owner);

  // We emit this event whenver a car is bought from seller to buyer
  event Bought(uint indexed _vinNumber, address indexed _oldOwner, address indexed _newOwner, uint _value);

  // We emit this event whenver a car is listed for sale
  event Listed(uint indexed _vinNumber, address indexed _carOwner, uint _value);

  struct Car {
    uint value;
    address owner;
    bool listed;
    uint index;
  }

  // A list of all registered cars
  uint[] cars;
  mapping(uint => Car) public carStructs;

  // A list of registered cars per owner
  mapping(address => uint[]) ownerToCars;

  // A list of car count per owner
  mapping(address => uint256) ownerCarCount;

  constructor() public {
  }

  function indexOf(address _owner, uint _vinNumber) internal view returns (uint) {
    uint i = 0;
    while (ownerToCars[_owner][i] != _vinNumber) {
      i++;
    }
    return i;
  }

  function removeOwnershipAtIndex(address _owner, uint _index) internal returns (bool success) {
    if (_index >= ownerToCars[_owner].length) return;

    for (uint i = _index; i < ownerToCars[_owner].length - 1; i++) {
      ownerToCars[_owner][i] = ownerToCars[_owner][i + 1];
    }

    delete ownerToCars[_owner][ownerToCars[_owner].length - 1];
    ownerToCars[_owner].length--;
    return true;
  }

  function removeOwnership(address _owner, uint _vinNumber) public returns (bool success) {
    uint index = indexOf(_owner, _vinNumber);
    removeOwnershipAtIndex(_owner, index);
    return true;
  }

  function register(address _owner, uint _vinNumber) public returns (bool success) {
    require(_owner != address(0));

    carStructs[_vinNumber].owner = _owner;
    carStructs[_vinNumber].value = 0;
    carStructs[_vinNumber].listed = false;
    carStructs[_vinNumber].index = cars.push(_vinNumber) - 1;

    ownerCarCount[_owner] = ownerCarCount[_owner] + 1;

    ownerToCars[_owner].push(_vinNumber);

    emit Registered(_vinNumber, _owner);

    return true;
  }

  function buy(uint _vinNumber, uint _value) public payable returns (bool success) {
    // require that the buyer is a true person
    require(msg.sender != address(0));
    //require that the car is for sale
    require(carStructs[_vinNumber].listed);
    //require that the amount of ether sent is equal to the value of that car
    require(msg.value == carStructs[_vinNumber].value);

    address previousOwner = carStructs[_vinNumber].owner;

    //change the ownershipt of the car
    carStructs[_vinNumber].owner = msg.sender;
    carStructs[_vinNumber].listed = false;

    ownerToCars[msg.sender].push(_vinNumber);
    removeOwnership(previousOwner, _vinNumber);

    ownerCarCount[msg.sender]++;
    ownerCarCount[previousOwner]--;

    // transfer the money to the seller
    previousOwner.transfer(msg.value);

    emit Bought(_vinNumber, previousOwner, msg.sender, msg.value);

    return true;
  }

  function list(uint _vinNumber, uint _value) public returns (bool success) {
    //require that the user is a true user
    require(msg.sender != address(0));

    // require that msg.sender is the owner of the car
    require(carStructs[_vinNumber].owner == msg.sender);

    carStructs[_vinNumber].value = _value;
    carStructs[_vinNumber].listed = true;

    emit Listed(_vinNumber, carStructs[_vinNumber].owner, _value);

    return true;
  }

  function ownedCars(address _owner) external view returns (uint[] vinNumbers) {
    require(_owner != address(0));
    return ownerToCars[_owner];
  }
}
