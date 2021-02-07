const RefiPolicy = artifacts.require("RefiPolicy");
const MyV2FlashLoan = artifacts.require("MyV2FlashLoan");
const MyV2CreditDelegation = artifacts.require("MyV2CreditDelegation");

module.exports = async function(deployer, network, accounts) {
  
  await deployer.deploy(RefiPolicy)
  const refiPolicy = await RefiPolicy.deployed();
  if (network.startsWith("kovan") || network.startsWith("live")) {
    // LINK Token address
    await refiPolicy.addAllowedTokens(
      "0xa36085F69e2889c224210F603D836748e7dC0088"
    );
    await refiPolicy.setPriceFeedContract(
      "0xa36085F69e2889c224210F603D836748e7dC0088",
      "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38"
    );
    // DAI Token address. 
    await refiPolicy.addAllowedTokens(
      "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"
    );
    await refiPolicy.setPriceFeedContract(
      "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
      "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a"
    );
  }

  try {
    let lendingPoolAddressesProviderAddress;
    switch(network) {
      case "mainnet":
      case "mainnet-fork":
      case "development": // For Ganache mainnet forks
          lendingPoolAddressesProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"; break
      case "kovan":
      case "kovan-fork":
          lendingPoolAddressesProviderAddress = "0x88757f2f99175387ab4c6a4b3067c77a695b0349"; break
      default:
          throw Error(`Are you deploying to the correct network? (network selected: ${network})`)
    }
    await deployer.deploy(MyV2FlashLoan, lendingPoolAddressesProviderAddress)
  } catch (e) {
      console.log(`Error in migration: ${e.message}`)
  }

  deployer.deploy(MyV2CreditDelegation);

};
