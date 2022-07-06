// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Main {

    struct User {
        address id;
        string name;
        string phone;
        string role;
        bool isCreated;
        uint createdAt;
    }

    struct Product {
        string mongoId;
        string productName;
        uint price;
        string description;
        address owner;
        uint count;
        bool isCreated;
        uint createdAt;
    }

    struct History {
        address prevOwner;
        string mongoId;
        string productName;
        uint price;
        string description;
        string actionName;
        uint transferDate;
    }

    struct OrderShipment {
        string purchaseId;
        string shipmentStatus;
        string deliveryAddress;
        address orderedBy;
        bool isConfirmed;
        bool isActive;
        uint createdAt;
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

    mapping(address => User) users;
    address[] public allUsers;

    mapping(string => Product) public products;
    mapping(address => string[]) public ownerProducts;
    //Product Id mapped to an array of productHistories
    mapping(string => History[]) public productHistories;
    string[] public allProducts;

    mapping(string => OrderShipment) public orderShipments;
    mapping(address => string[]) public userPurchaseIds;
    mapping(address => string[]) public sellerPurchaseIds;
    //shipment history mapped to purchase id
    mapping(string => ShipmentHistory[]) public shipmentHistoryHistories;
    //shipment item list mapped to purchase id
    mapping(string => ShipmentItem[]) public shipmentItemsList;

    function userSignUp(
        string memory _name,
        string memory _phone,
        string memory _role,
        address userAddress
    ) public {
        require(!users[userAddress].isCreated, "You are Already Registered!");

        User memory user = User(
            userAddress,
            _name,
            _phone,
            _role,
            true,
            block.timestamp
        );

        users[userAddress] = user;
        allUsers.push(userAddress);
    }

    function getAllUser() public view returns (User[] memory){
        User[] memory res = new User[](allUsers.length);
        for (uint i = 0; i < allUsers.length; i++) {
            res[i] = users[allUsers[i]];
        }
        return res;
    }

    function createProduct(
        string memory _mongoId,
        string memory _productName,
        uint _price,
        string memory _description,
        uint _count,
        address productOwner
    ) external {
        require(!products[_mongoId].isCreated, "Item already created!");
        // require(users[msg.sender].isCreated, "You are not Registered as Seller"); //check user role

        Product memory product = Product(
            _mongoId,
            _productName,
            _price,
            _description,
            productOwner,
            _count,
            true,
            block.timestamp
        );

        products[_mongoId] = product;
        ownerProducts[productOwner].push(_mongoId);

        addProductHistory(_mongoId, _price, _description, "Created");

        allProducts.push(_mongoId);
    }

    function buyProduct(string memory _productId, string memory newMongoId, uint amount, address buyerAddress) public {
        Product memory product = products[_productId];

        products[newMongoId] = product;
        products[newMongoId].owner = buyerAddress;
        products[newMongoId].count = amount;

        products[_productId].count -= amount;

        for (uint i = 0; i < productHistories[_productId].length; i++){
            productHistories[newMongoId].push(productHistories[_productId][i]);
        }

        ownerProducts[buyerAddress].push(newMongoId);

        addProductHistory(newMongoId, products[newMongoId].price, products[newMongoId].description, "Bought");
    }

    function getSingleProductById(string memory _mongoId) external view returns (Product memory){
        Product memory res = products[_mongoId];
        return res;
    }

    function getAllProducts() external view returns (Product[] memory){
        Product[] memory res = new Product[](allProducts.length);
        for (uint i = 0; i < allProducts.length; i++) {
            res[i] = products[allProducts[i]];
        }
        return res;
    }

    function getProductHistory(string memory _productId) external view returns (History[] memory) {
        return productHistories[_productId];
    }

    function setOwner(string memory _productId, address newOwner) public {
        products[_productId].owner = newOwner;
    }

    function addProductHistory(
        string memory _productId,
        uint _price,
        string memory _description,
        string memory actionName
    ) public {
        History memory _history = History(
            products[_productId].owner,
            _productId,
            products[_productId].productName,
            _price,
            _description,
            actionName,
            block.timestamp
        );
        productHistories[_productId].push(_history);
    }

    function createOrder(
        address buyerAddress,
        string memory _status,
        string memory _productId,
        address ownerAddress,
        string memory buyerDeliveryAddress,
        string memory purchaseId
    ) external returns (string memory){
        require(products[_productId].isCreated, "Item does not exist!");

        OrderShipment memory order = OrderShipment(
            purchaseId,
            _status,
            buyerDeliveryAddress,
            buyerAddress,
            false,
            false,
            block.timestamp
        );
        orderShipments[purchaseId] = order;

        userPurchaseIds[buyerAddress].push(purchaseId);
        sellerPurchaseIds[ownerAddress].push(purchaseId);
        return purchaseId;
    }

    function addItemToOrder(string memory _purchaseId, ShipmentItem memory _shipmentItem) external {
        shipmentItemsList[_purchaseId].push(_shipmentItem);
    }

    function getOrderItems(string memory _purchaseId) public view returns (ShipmentItem[] memory) {
        return shipmentItemsList[_purchaseId];
    }

    function addHistoryToOrder(string memory _purchaseId, ShipmentHistory memory _shipmentHistory) external {
        shipmentHistoryHistories[_purchaseId].push(_shipmentHistory);
    }

    function getOrderHistory(string memory _purchaseId) public view returns (ShipmentHistory[] memory) {
        return shipmentHistoryHistories[_purchaseId];
    }

    function getUserOrders(address userAddress) external view returns (OrderShipment[] memory) {
        string[] memory purchaseIds = userPurchaseIds[userAddress];
        OrderShipment[] memory orders = new OrderShipment[](purchaseIds.length);
        for (uint i = 0; i < purchaseIds.length; i++) {
            orders[i] = orderShipments[purchaseIds[i]];
        }
        return orders;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function getUserOrderDetail(string memory _purchaseId) external view returns (
        OrderShipment memory, ShipmentItem[] memory, ShipmentHistory[] memory
    ) {
        return (orderShipments[_purchaseId], shipmentItemsList[_purchaseId], shipmentHistoryHistories[_purchaseId]);
    }

    function getSellerOrders(address sellerAddress) external view returns (OrderShipment[] memory) {
        string[] memory purchaseIds = sellerPurchaseIds[sellerAddress];
        OrderShipment[] memory orders = new OrderShipment[](purchaseIds.length);
        for (uint i = 0; i < purchaseIds.length; i++) {
            orders[i] = orderShipments[purchaseIds[i]];
        }
        return orders;
    }

    function getSellerOrderDetail(string memory _purchaseId) external view returns (
        OrderShipment memory, ShipmentItem[] memory, ShipmentHistory[] memory
    ) {
        return (orderShipments[_purchaseId], shipmentItemsList[_purchaseId], shipmentHistoryHistories[_purchaseId]);
    }

}