// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Library.sol";
import "./ProductContract.sol";

contract OrderContract {
    /*
        The owner of the contract is the deployer
    */
    address public _owner;
    address public supplyChainAddress;

    ProductContract product;

    /*
        Set owner of the contract to the deployer
    */
    constructor(address _supplyChainAddress, address _productContractAddress) {
        _owner = msg.sender;
        supplyChainAddress = _supplyChainAddress;
        product = ProductContract(_productContractAddress);
    }

    function setSupplyChainAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        supplyChainAddress = add;
    }

    struct OrderShipment {
        string purchaseId;
        string shipmentStatus;
        string deliveryAddress;
        address orderedBy;
        bool isConfirmed;
        bool isActive;
        bool isCanceled;
        uint createdAt;
        uint updatedAt;
    }

    struct ShipmentHistory {
        string orderActionType;
        string message;
        uint date;
    }

    struct ShipmentItem {
        string description;
        string productId;
        string newMongoId;
        uint price;
        uint amount;
    }

    mapping(string => OrderShipment) public orderShipments;
    mapping(address => string[]) public userPurchaseIds;
    mapping(address => string[]) public sellerPurchaseIds;
    //shipment history mapped to purchase id
    mapping(string => ShipmentHistory[]) public shipmentHistoryHistories;
    //shipment item list mapped to purchase id
    mapping(string => ShipmentItem[]) public shipmentItemsList;


    function createOrder(
        address buyerAddress,
        string memory _status,
        address ownerAddress,
        string memory buyerDeliveryAddress,
        string memory purchaseId
    ) external returns (string memory){//payable
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        // require(products[_productId].isCreated, "Item does not exist!");
        // require(products[_productId].isAvailable, "Item is not available for sell.");
        // require(products[_productId].owner != buyerAddress, "You Can not buy your own Item!");
        // products[_productId].seller.transfer(msg.value);

        OrderShipment memory order = OrderShipment(
            purchaseId,
            _status,
            buyerDeliveryAddress,
            buyerAddress,
            false,
            true,
            false,
            block.timestamp,
            block.timestamp
        );
        orderShipments[purchaseId] = order;

        userPurchaseIds[buyerAddress].push(purchaseId);
        sellerPurchaseIds[ownerAddress].push(purchaseId);
        return purchaseId;
    }

    function addItemToOrder(string memory _purchaseId, ShipmentItem memory _shipmentItem) external {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        shipmentItemsList[_purchaseId].push(_shipmentItem);
    }

    function getOrderItems(string memory _purchaseId) public view returns (ShipmentItem[] memory) {
        return shipmentItemsList[_purchaseId];
    }

    function addHistoryToOrder(string memory _purchaseId, ShipmentHistory memory _shipmentHistory) external {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        shipmentHistoryHistories[_purchaseId].push(_shipmentHistory);
    }

    function getOrderHistory(string memory _purchaseId) public view returns (ShipmentHistory[] memory) {
        return shipmentHistoryHistories[_purchaseId];
    }

    function getUserOrders(address userAddress) external view returns (OrderShipment[] memory) {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");

        string[] memory purchaseIds = userPurchaseIds[userAddress];
        OrderShipment[] memory orders = new OrderShipment[](purchaseIds.length);
        for (uint i = 0; i < purchaseIds.length; i++) {
            orders[i] = orderShipments[purchaseIds[i]];
        }
        return orders;
    }

    function getUserPurchaseId(string memory _purchaseId, address userAddress) private view returns (bool) {
        string[] memory purchaseIds = userPurchaseIds[userAddress];
        for (uint i = 0; i < purchaseIds.length; i++) {
            if (Library.compareStrings(purchaseIds[i], _purchaseId)) {
                return true;
            }
        }
        return false;
    }

    function getUserOrderDetail(string memory _purchaseId, address userAddress) external view returns (
        OrderShipment memory, ShipmentItem[] memory, ShipmentHistory[] memory
    ) {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
//        require(getUserPurchaseId(_purchaseId, userAddress), "Purchase Id does not exist");

        return (orderShipments[_purchaseId], shipmentItemsList[_purchaseId], shipmentHistoryHistories[_purchaseId]);
    }

    function getSellerOrders(address sellerAddress) external view returns (OrderShipment[] memory) {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");

        string[] memory purchaseIds = sellerPurchaseIds[sellerAddress];
        OrderShipment[] memory orders = new OrderShipment[](purchaseIds.length);
        for (uint i = 0; i < purchaseIds.length; i++) {
            orders[i] = orderShipments[purchaseIds[i]];
        }
        return orders;
    }

    function getSellerPurchaseId(string memory _purchaseId, address sellerAddress) private view returns (bool) {
        string[] memory purchaseIds = sellerPurchaseIds[sellerAddress];
        for (uint i = 0; i < purchaseIds.length; i++) {
            if (Library.compareStrings(purchaseIds[i], _purchaseId)) {
                return true;
            }
        }
        return false;
    }

    function getSellerOrderDetail(string memory _purchaseId, address sellerAddress) external view returns (
        OrderShipment memory, ShipmentItem[] memory, ShipmentHistory[] memory
    ) {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
//        require(getSellerPurchaseId(_purchaseId, sellerAddress), "Purchase Id does not exist");
        return (orderShipments[_purchaseId], shipmentItemsList[_purchaseId], shipmentHistoryHistories[_purchaseId]);
    }

    function confirmUserOrder(string memory _purchaseId, address userAddress, string memory prevOwnerName) external {
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        // require(getUserPurchaseId(_purchaseId, userAddress), "Purchase Id does not exist");
        orderShipments[_purchaseId].isConfirmed = true;

        ShipmentItem[] memory orderedItems = shipmentItemsList[_purchaseId];
        for (uint i = 0; i < orderedItems.length; i++){
            product.buyProduct(
                orderedItems[i].productId,
                orderedItems[i].newMongoId,
                orderedItems[i].amount,
                userAddress,
                    prevOwnerName
            );
        }
    }

    function cancelOrder(string memory _purchaseId, address userAddress) external {//payable
        require(msg.sender == supplyChainAddress, "Unauthorized access!");
//        require(
//            getUserPurchaseId(_purchaseId, userAddress) ||
//            getSellerPurchaseId(_purchaseId, userAddress),
//            "Purchase Id does not exist"
//        );
//        require(!orderShipments[_purchaseId].isActive, "You Already Canceled This order!");
//        require(!Library.compareStrings(orderShipments[_purchaseId].shipmentStatus, "initial shipment status"),
//            "You Already Canceled This order!");

        orderShipments[_purchaseId].isActive = false;
    }
}