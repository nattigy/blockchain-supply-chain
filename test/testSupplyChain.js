const SupplyChain = artifacts.require("SupplyChain");
const ProductContract = artifacts.require("ProductContract");
const UserContract = artifacts.require("UserContract");

contract('SupplyChain', async function (accounts) {
    let supplyChain, productContract, userContract;
    let supplyChainAddress, productAddress, userAddress;
    let ownerAccount, sellerAccount, deliveryAccount, customerAccount;

    before(async () => {
        supplyChain = await SupplyChain.new();
        supplyChainAddress = supplyChain.address;

        productContract = await ProductContract.new(supplyChainAddress);
        productAddress = productContract.address;

        userContract = await UserContract.new(supplyChainAddress);
        userAddress = userContract.address;

        ownerAccount = accounts[0];
        sellerAccount = accounts[1];
        deliveryAccount = accounts[2];
        customerAccount = accounts[3];
    });

    it("Only owner can set contract address", async function () {
        await supplyChain.setProductContractAddress(productAddress, {from: ownerAccount});
        await supplyChain.setUserContractAddress(userAddress, {from: ownerAccount});
        const productContractAddress = await supplyChain.productContractAddress.call();
        const userContractAddress = await supplyChain.userContractAddress.call();

        assert.equal(productAddress, productContractAddress, "Supply chain address in product contract not the same");
        assert.equal(userAddress, userContractAddress, "Supply chain address in user contract not the same");
    });

    it("should not set contract address", async function () {
        await supplyChain.setProductContractAddress(userAddress, {from: sellerAccount})
            .then(() => {}).catch(() => {});
        await supplyChain.setUserContractAddress(productAddress, {from: customerAccount})
            .then(() => {}).catch(() => {});
        const productContractAddress = await supplyChain.productContractAddress.call();
        const userContractAddress = await supplyChain.userContractAddress.call();

        assert.equal(productAddress, productContractAddress, "Supply chain address in product contract not the same");
        assert.equal(userAddress, userContractAddress, "Supply chain address in user contract not the same");
    });

    it("should register all users", async function () {
        //seller registration
        await supplyChain.userSignUp(
            "Nathnael",
            "7864656456",
            "SELLER",
            {from: sellerAccount});
        const seller = await supplyChain.getUserByAddress(sellerAccount);

        //delivery registration
        await supplyChain.userSignUp(
            "Biruk",
            "4547645",
            "DELIVERY",
            {from: deliveryAccount});
        const delivery = await supplyChain.getUserByAddress(deliveryAccount);

        //customer registration
        await supplyChain.userSignUp(
            "Moti",
            "4867878",
            "CUSTOMER",
            {from: customerAccount});
        const customer = await supplyChain.getUserByAddress(customerAccount);

        assert.equal("Nathnael", seller.name, "Seller user not registered correctly");
        assert.equal("Biruk", delivery.name, "Delivery user not registered correctly");
        assert.equal("Moti", customer.name, "Customer user not registered correctly");
    });

    it("should return all users", async function () {
        const users = await supplyChain.getAllUser();

        assert.equal(users.length, 3, "length is not equal");
    });

    it("should create an item correctly", async function () {
        const _productId = "item1";
        const _productName = "earbuds";
        const _category = "accessory";
        const _price = 50;
        const _description = "best earbuds";
        const _instanceNumber = 2;

        await supplyChain.addProduct(_productId, _productName, _category, _price, _description, _instanceNumber, {from: sellerAccount});
        const product = await supplyChain.getProductById(_productId);

        assert.equal(product.productId, _productId, "_productId not the same");
        assert.equal(product.productName, _productName, "_productName not the same");
        assert.equal(product.category, _category, "_category not the same");
        assert.equal(product.price, _price, "_price not the same");
        assert.equal(product.description, _description, "_description not the same");
    });

    // it("should get a product by product id", async function () {
    //     const _productId = "item1";
    //     const product = await supplyChain.getProductById(_productId);
    //     assert.equal(product.productId, _productId, "_productId not the same");
    // });
    //
    // it("should get all products", async function () {
    //     const products = await supplyChain.getAllProducts();
    //
    //     assert.equal(products.length, 1, "length is not equal");
    // });

    // it("should buy an item correctly", async function() {
    //   //buyProduct(string memory _productId)
    // });
    //
    // it("should cancel an order", async function() {
    //   //cancelOrder(string memory _productId, uint _purchaseId)
    // });
    //
    // it("should change product availability status", async function() {
    //   //changeProductAvailability(string memory productId, bool _available)
    // });
    //
    // it("should update shipment information", async function() {
    //   //updateShipment(uint _purchaseId, string memory _newShipmentStatus)
    // });
    //
    // it("should return item history starting from the first sell", async function() {
    //   //getProductHistory(string memory _productId) public view returns(History[] memory)
    // });
    //
    // it("should return all user orders", async function() {
    //   //getUserOrders() public view returns(UserOrders[] memory)
    // });
    //
    // it("should return user order detail", async function() {
    //   //getUserOrderDetail (uint _index) public view returns (string memory, string memory, uint, string memory)
    // });
    //
    // it("should return placed orders for a supplier", async function() {
    //   //getPlacedOrders() public view returns (OrdersPlaced[] memory)
    // });
    //
    // it("should return placed order detail", async function() {
    //   //getPlacedOrderDetail(uint _index) public view returns (string memory, uint, address, string memory)
    // });
    //
    // it("should return all shipments for a supplier", async function() {
    //   //getShipments() public view returns(SellerShipment[] memory)
    // });
    //
    // it("should return shipment detail", async function() {
    //   //getShipmentDetails(uint _purchaseId) public view returns(string memory, string memory, address, string memory)
    // });
});
