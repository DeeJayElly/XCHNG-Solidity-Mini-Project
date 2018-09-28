pragma solidity ^0.4.24;

import './Ownable.sol';

contract CarExchange is Ownable {

  // We emit this event whenever a car is newly registered to the blockchain
  event Registered(uint indexed _vinNumber, address indexed _owner);

  // We emit this event whenever a car is bought from seller to buyer
  event Bought(uint indexed _vinNumber, address indexed _oldOwner, address indexed _newOwner, uint _value);

  // We emit this event whenever a car is listed for sale
  event Listed(uint indexed _vinNumber, address indexed _carOwner, uint _value);

  // Car structure
  struct Car {
    uint value;
    address owner;
    bool listed;
    uint index;
  }

  // A list of all registered cars
  uint[] cars;

  // Mapping which contains all car id'' connected to their car structures
  mapping(uint => Car) public carStructs;

  // A list of registered cars per owner
  mapping(address => uint[]) ownerToCars;

  // A list of car count per owner
  mapping(address => uint) ownerCarCount;

  /**
   * @dev CarExchange constructor function.
   */
  constructor() public {
  }

  /**
   * @dev Find index of owned cars function.
   *
   * @param _owner address - The address of owner of the car.
   * @param _vinNumber uint - Vin number of the car (id of the car).
   * @return uint - Index of the car.
   */
  function indexOf(address _owner, uint _vinNumber) internal view returns (uint) {
    uint i = 0;
    while (ownerToCars[_owner][i] != _vinNumber) {
      i++;
    }
    return i;
  }

  /**
   * @dev Remove ownership at the give index function.
   *
   * @param _owner address - The address of owner of the car.
   * @param _index uint - Index of the given car.
   * @return bool - Success if the removal of the ownership has happen.
   */
  function removeOwnershipAtIndex(address _owner, uint _index) internal returns (bool success) {
    if (_index >= ownerToCars[_owner].length) return;

    for (uint i = _index; i < ownerToCars[_owner].length - 1; i++) {
      ownerToCars[_owner][i] = ownerToCars[_owner][i + 1];
    }

    delete ownerToCars[_owner][ownerToCars[_owner].length - 1];
    ownerToCars[_owner].length--;
    return true;
  }

  /**
   * @dev Remove ownership function.
   *
   * @param _owner address - The address of owner of the car.
   * @param _vinNumber uint - Vin Number (index) of the given car.
   * @return bool - Success if the removal of the ownership has happen.
   */
  function removeOwnership(address _owner, uint _vinNumber) public returns (bool success) {
    uint index = indexOf(_owner, _vinNumber);
    removeOwnershipAtIndex(_owner, index);
    return true;
  }

  function getCarCount() public view returns (uint) {
    return cars.length;
  }

  function getCar(uint _vinNumber) public view returns (uint value, address owner, bool listed, uint index) {
    return (carStructs[_vinNumber].value, carStructs[_vinNumber].owner, carStructs[_vinNumber].listed, carStructs[_vinNumber].index);
  }

  function getCarCountPerOwner(address _owner) public view returns (uint count) {
    require(_owner != address(0));
    return ownerCarCount[_owner];
  }

  /**
   * @dev Register car function.
   *
   * @param _owner address - The address of owner of the car.
   * @param _vinNumber uint - Vin Number (index) of the given car.
   * @return bool - Success if the removal of the ownership has happen.
   */
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

  /**
   * @dev Buy car function.
   *
   * @param _vinNumber uint - Vin number (index) of the car.
   * @param _value uint - Price of the car.
   * @return bool - Success if the removal of the ownership has happen.
   */
  function buy(uint _vinNumber, uint _value) public payable returns (bool success) {
    // require that the buyer is a true person
    require(msg.sender != address(0));
    //require that the car is for sale
    require(carStructs[_vinNumber].listed);
    //require that the amount of ether sent is equal to the value of that car
    require(_value == carStructs[_vinNumber].value);

    address previousOwner = carStructs[_vinNumber].owner;

    //change the ownership of the car
    carStructs[_vinNumber].owner = msg.sender;
    carStructs[_vinNumber].listed = false;

    ownerToCars[msg.sender].push(_vinNumber);
    removeOwnership(previousOwner, _vinNumber);

    ownerCarCount[msg.sender]++;
    ownerCarCount[previousOwner]--;

    // transfer the money to the seller
    previousOwner.transfer(_value);

    emit Bought(_vinNumber, previousOwner, msg.sender, _value);

    return true;
  }

  /**
   * @dev List car for sale function.
   *
   * @param _vinNumber uint - Vin number (index) of the car.
   * @param _value uint - Price of the car.
   * @return bool - Success if the removal of the ownership has happen.
   */
  function list(uint _vinNumber, uint _value) public returns (bool success) {
    //require that the user is a true user
    require(msg.sender != address(0));

    // require that msg.sender is the owner of the car
    require(carStructs[_vinNumber].owner == msg.sender);

    carStructs[_vinNumber].value = _value;
    carStructs[_vinNumber].listed = true;

    emit Listed(_vinNumber, msg.sender, _value);

    return true;
  }

  /**
   * @dev Return owned cars function.
   *
   * @param _owner address - The address of owner of the cars.
   * @return vinNumbers uint[] - Vin numbers (indexes) of the cars owned by the given owner.
   */
  function ownedCars(address _owner) external view returns (uint[] vinNumbers) {
    require(_owner != address(0));
    return ownerToCars[_owner];
  }

  function getAllListedCars() public view returns (uint, uint[], uint[], address[]) {
    uint[] memory carList = new uint[](cars.length);
    uint[] memory valueList = new uint[](cars.length);
    address[] memory ownerList = new address[](cars.length);
    uint j = 0;
    for (uint i = 0; i < cars.length; i++) {
      Car storage car = carStructs[cars[i]];
      if (car.listed) {
        carList[j] = cars[i];
        valueList[j] = car.value;
        ownerList[j] = car.owner;
        j++;
      }
    }
    return (j, carList, valueList, ownerList);
  }
}
