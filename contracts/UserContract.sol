// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Library.sol";

contract UserContract {
    /*
        The owner of the contract is the deployer
    */
    address _owner;
    address public supplyChainAddress;

    /*
        Set owner of the contract to the deployer
    */
    constructor(address add) {
        _owner = msg.sender;
        supplyChainAddress = add;
    }

    function setSupplyChainAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        supplyChainAddress = add;
    }

    uint id;

    /*
        Any registered user can sell and buy a product
    */
    struct User {
        address id;
        string name;
        string phone;
        string role;
        bool isCreated;
        uint createdAt;
        uint updatedAt;
    }

    mapping(address => User) users;
    address[] public allUsers;

    function createUser(
        string memory _name,
        string memory _phone,
        string memory _role,
        address userAddress
    ) public {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        require(!users[userAddress].isCreated, "You are Already Registered!");
        require(
            !Library.compareStrings(_name, "") ||
        !Library.compareStrings(_phone, ""),
            "Please fill in the required fields!"
        );

        User memory user = User(
            userAddress,
            _name,
            _phone,
            _role,
            true,
            block.timestamp,
            block.timestamp
        );

        users[userAddress] = user;
        allUsers.push(userAddress);
    }

    function getUserByAddress(address _userId) public view returns (User memory){
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        User memory res = users[_userId];
        return res;
    }

    function getAllUser() public view returns (User[] memory){
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        User[] memory res = new User[](allUsers.length);
        for (uint i = 0; i < allUsers.length; i++) {
            res[i] = users[allUsers[i]];
        }
        return res;
    }

}