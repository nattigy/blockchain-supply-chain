const Library = artifacts.require("Library");
const SupplyChain = artifacts.require("SupplyChain");
const ProductContract = artifacts.require("ProductContract");
const UserContract = artifacts.require("UserContract");
const OrderContract = artifacts.require("OrderContract");
// const Main = artifacts.require("Main");

module.exports = function(deployer) {
  deployer.deploy(Library);
  deployer.link(Library, SupplyChain);
  deployer.link(Library, ProductContract);
  deployer.link(Library, UserContract);
  deployer.link(Library, OrderContract);
  deployer.deploy(SupplyChain).then(function () {
    return deployer.deploy(ProductContract, SupplyChain.address).then(function () {
      deployer.link(ProductContract, OrderContract);
      return deployer.deploy(OrderContract, SupplyChain.address, ProductContract.address).then(function () {
        return deployer.deploy(UserContract, SupplyChain.address)
      })
    })
  });
};

// module.exports = function(deployer) {
//   deployer.deploy(Main);
// };

