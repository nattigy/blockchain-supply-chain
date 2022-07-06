// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Library.sol";

contract ProductContract {
    /*
        The owner of the contract is the deployer
    */
    address public _owner;
    address public supplyChainAddress;

    // /*
    //     Set owner of the contract to the deployer
    // */
    constructor(address add) {
        _owner = msg.sender;
        supplyChainAddress = add;
    }

    function setSupplyChainAddress(address add) external {
        require(msg.sender == _owner, "Unauthorized access!");
        supplyChainAddress = add;
    }

    /*
        Item fields
    */
    struct Product {
        string mongoId;
        string productName;
        string category;
        uint price;
        string description;
        address owner;
        uint count;
        bool isCreated;
        uint createdAt;
        uint updatedAt;
    }

    struct ProductView {
        string mongoId;
        string name;
        uint price;
        string category;
        string description;
        uint count;
        address owner;
    }

    struct History {
        address prevOwner;
        string prevOwnerName;
        string mongoId;
        string productName;
        string category;
        uint price;
        string description;
        string actionName;
        uint transferDate;
    }

    mapping(string => Product) public products;
    mapping(address => string[]) public ownerProducts;
    //Product Id mapped to an array of productHistories
    mapping(string => History[]) public productHistories;
    string[] public allProducts;

    function createProduct(
        string memory _mongoId,
        string memory _productName,
        string memory _category,
        uint _price,
        string memory _description,
        uint _count,
        address productOwner,
        string memory prevOwnerName
    ) public {
        //        require(msg.sender == supplyChainAddress, "Unauthorized access!");
        //        require(!products[_mongoId].isCreated, "Item already created!");
        // require(users[msg.sender].isCreated, "You are not Registered as Seller"); //check user role

        Product memory product = Product(
            _mongoId,
            _productName,
            _category,
            _price,
            _description,
            productOwner,
            _count,
            true,
            block.timestamp,
            block.timestamp
        );

        products[_mongoId] = product;
        ownerProducts[productOwner].push(_mongoId);

        addProductHistory(_mongoId, _price, _description, prevOwnerName, "Created");

        allProducts.push(_mongoId);
    }

    function buyProduct(
        string memory _productId,
        string memory newMongoId,
        uint amount,
        address buyerAddress,
        string memory prevOwnerName
    ) public {
        require(amount <= products[_productId].count, "Not enough items available");

        Product memory oldProduct = products[_productId];

        Product memory product = Product(
            newMongoId,
            oldProduct.productName,
            oldProduct.category,
            oldProduct.price,
            oldProduct.description,
            buyerAddress,
            amount,
            true,
            block.timestamp,
            block.timestamp
        );

        products[newMongoId] = product;
        allProducts.push(newMongoId);
        //        products[newMongoId].owner = buyerAddress;
        //        products[newMongoId].count = amount;

        products[_productId].count -= amount;

        for (uint i = 0; i < productHistories[_productId].length; i++) {
            productHistories[newMongoId].push(productHistories[_productId][i]);
        }

        addProductHistory(newMongoId, products[newMongoId].price, products[newMongoId].description, prevOwnerName, "Bought");

        ownerProducts[buyerAddress].push(newMongoId);
    }

    function getSingleProductById(string memory _mongoId) external view returns (Product memory){
        Product memory res = products[_mongoId];
        return res;
    }

    function getAllProducts() external view returns (ProductView[] memory){
        ProductView[] memory res = new ProductView[](allProducts.length);
        for (uint i = 0; i < allProducts.length; i++) {
            string memory mongoId = allProducts[i];
            string memory name = products[allProducts[i]].productName;
            uint price = products[allProducts[i]].price;
            string memory category = products[allProducts[i]].category;
            string memory description = products[allProducts[i]].description;
            uint count = products[allProducts[i]].count;
            address productOwner = products[allProducts[i]].owner;
            res[i] = ProductView(mongoId, name, price, category, description, count, productOwner);
        }
        return res;
    }

    function getUserProducts(address _productOwner) external view returns (ProductView[] memory){
        require(msg.sender == supplyChainAddress, "Unauthorized access!");

        string[] memory op = ownerProducts[_productOwner];
        ProductView[] memory res = new ProductView[](op.length);
        for (uint i = 0; i < op.length; i++) {
            string memory mongoId = op[i];
            string memory name = products[op[i]].productName;
            uint price = products[op[i]].price;
            string memory category = products[op[i]].category;
            string memory description = products[op[i]].description;
            uint count = products[op[i]].count;
            address productOwner = products[op[i]].owner;
            res[i] = ProductView(mongoId, name, price, category, description, count, productOwner);
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
        string memory prevOwnerName,
        string memory actionName
    ) public {
        History memory _history = History(
            products[_productId].owner,
            prevOwnerName,
            _productId,
            products[_productId].productName,
            products[_productId].category,
            _price,
            _description,
            actionName,
            block.timestamp
        );
        productHistories[_productId].push(_history);
    }

}