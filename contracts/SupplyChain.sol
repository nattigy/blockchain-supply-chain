// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProductContract.sol";
import "./OrderContract.sol";
import "./UserContract.sol";
import "./Library.sol";

contract SupplyChain {
    /*
        The owner of the contract is the deployer
    */
    address _owner;
    address public productContractAddress;
    address public orderContractAddress;
    address public userContractAddress;

    ProductContract product;
    OrderContract order;
    UserContract user;

    /*
        Set owner of the contract to the deployer
    */
    constructor() {
        _owner = msg.sender;
    }

    function setProductContractAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        product = ProductContract(add);
        productContractAddress = add;
    }

    function setUserContractAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        user = UserContract(add);
        userContractAddress = add;
    }

    function setOrderContractAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        order = OrderContract(add);
        orderContractAddress = add;
    }

    function createUser(
        string memory _name,
        string memory _phone,
        string memory _role
    ) public {
        user.createUser(
            _name,
            _phone,
            _role,
            msg.sender
        );
    }

    function getUserByAddress(address _userId) public view returns (UserContract.User memory){
        return user.getUserByAddress(_userId);
    }

    function getAllUser() public view returns (UserContract.User[] memory){
        return user.getAllUser();
    }

    function createProduct(
        string memory _mongoId,
        string memory _productName,
        string memory _category,
        uint _price,
        string memory _description,
        uint _count,
        string memory prevOwnerName
    ) public {
        //        require(user.getUserByAddress(msg.sender).isCreated, "You are not Registered as Seller!");
        // require(users[msg.sender].isCreated, "You are not Registered as Seller"); //check user role

        product.createProduct(
            _mongoId,
            _productName,
            _category,
            _price,
            _description,
            _count,
            msg.sender,
            prevOwnerName
        );
    }

    function buyProduct(
        string memory _productId,
        string memory _newMongoId,
        uint _amount,
        string memory prevOwnerName
    ) public {
        //        require(user.getUserByAddress(msg.sender).isCreated, "You are not Registered as Seller!");
        // require(users[msg.sender].isCreated, "You are not Registered as Seller"); //check user role
        product.buyProduct(
            _productId,
            _newMongoId,
            _amount,
            msg.sender,
            prevOwnerName
        );
    }

    function getSingleProductById(string memory _productId) public view returns (ProductContract.Product memory){
        return product.getSingleProductById(_productId);
    }

    function getAllProducts() public view returns (ProductContract.ProductView[] memory){
        return product.getAllProducts();
    }

    function getUserProducts() public view returns (ProductContract.ProductView[] memory){
        return product.getUserProducts(msg.sender);
    }

    function getProductHistory(string memory _productId) public view returns (ProductContract.History[] memory) {
        return product.getProductHistory(_productId);
    }

    function createOrder(address ownerAddress, string memory _status, string memory buyerDeliveryAddress, string memory purchaseId) public {//payable
        require(user.getUserByAddress(msg.sender).isCreated, "You Must Be Registered to Buy!");
        order.createOrder(msg.sender, _status, ownerAddress, buyerDeliveryAddress, purchaseId);
    }

    function addItemToOrder(string memory _purchaseId, OrderContract.ShipmentItem memory _shipmentItem) external {
        // require(order.orderShipments[_purchaseId].isActive, "Purchase Id does not exist");
        // require(order.orderShipments[_purchaseId].orderedBy == msg.sender, "Access denied");
        order.addItemToOrder(_purchaseId, _shipmentItem);
    }

    function addHistoryToOrder(string memory _purchaseId, OrderContract.ShipmentHistory memory _shipmentHistory) external {
        // require(product.orderShipments[_purchaseId].isActive, "Purchase Id does not exist");
        order.addHistoryToOrder(_purchaseId, _shipmentHistory);
    }

    function getUserOrders() public view returns (OrderContract.OrderShipment[] memory) {
        return order.getUserOrders(msg.sender);
    }

    function getUserOrderDetail(string memory _purchaseId) public view returns
    (OrderContract.OrderShipment memory, OrderContract.ShipmentItem[] memory, OrderContract.ShipmentHistory[] memory) {
        return order.getUserOrderDetail(_purchaseId, msg.sender);
    }

    function getSellerOrders() public view returns (OrderContract.OrderShipment[] memory) {
        return order.getSellerOrders(msg.sender);
    }

    function getSellerOrderDetail(string memory _purchaseId) public view returns
    (OrderContract.OrderShipment memory, OrderContract.ShipmentItem[] memory, OrderContract.ShipmentHistory[] memory) {
        return order.getSellerOrderDetail(_purchaseId, msg.sender);
    }

    function confirmUserOrder(string memory _purchaseId, string memory prevOwnerName) public {
        order.confirmUserOrder(_purchaseId, msg.sender, prevOwnerName);
    }

    function cancelOrder(string memory _purchaseId) public {//payable
        order.cancelOrder(_purchaseId, msg.sender);
    }

}