
// ABI imports
import ERC20ABI from '../../ABI/ERC20ABI.json'
import LendingPoolAddressProviderABI from '../../ABI/LendingPoolAddressesProvider.json'
import LendingPoolABI from '../../ABI/LendingPool.json'

//mainNet Addess
const daiAddressMain = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

//KOVAN V2 
const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"; 
const lpAddressProviderAddress = "0x88757f2f99175387ab4c6a4b3067c77a695b0349"


// Get the latest LendingPool address
async function getLendingPoolAddress(web3) {
    const lpAddress = await getLendingPoolAddressProviderContract(web3).methods
      .getLendingPool()
      .call()
      .catch((e) => {
        throw Error(`Error getting lendingPool address: ${e.message}`)
      })
    console.log("LendingPool address: ", lpAddress)
    return lpAddress
  }

 // Create the LendingPoolAddressProvider contract instance
 function getLendingPoolAddressProviderContract(web3) {
    const lpAddressProviderContract = new web3.eth.Contract(LendingPoolAddressProviderABI.abi, 
                            lpAddressProviderAddress);
    return lpAddressProviderContract;
 }

/**
   * Deposit DAI into Aave to receive the equivalent AAVE DAI 
   * --Note: User must have DAI already in their wallet!
   */
export const deposit = async (web3, myAddress, depositAmt) => {
    const daiAmountinWei = web3.utils.toWei(depositAmt, "ether").toString();
    const referralCode = "0";
    try {
        // Approve the LendingPoolCore address with the DAI contract
        const daiContract = new web3.eth.Contract(ERC20ABI, daiAddressKovan)

        // Make the deposit transaction via LendingPool contract
        const lpAddress = await getLendingPoolAddress(web3);

        await daiContract.methods
          .approve(lpAddress, daiAmountinWei)
          .send({ from: myAddress })
          .catch((e) => {
            throw Error(`Error approving DAI allowance: ${e.message}`)
          })
  
        const lpContract = new web3.eth.Contract(LendingPoolABI.abi, lpAddress)
        await lpContract.methods
          .deposit(daiAddressKovan, daiAmountinWei, myAddress, referralCode)
          .send({ from: myAddress })
          .catch((e) => {
            throw Error(`Error depositing to the LendingPool contract: ${e.message}`)
          })
      } catch (e) {
        alert(e.message)
        console.log(e.message)
      }
      //call to record the Aave amount for the address in the contract
      //addAaveToContract(depositAmt,aDaiAddress)
}

 /**
   * Borrow DAI from Aave
   * Note: User must have already deposited some collateral to borrow
   */
  export const borrow = async (web3, myAddress, borrowAmt) => {
    console.log('in Borrow: ');
    const daiAmountinWei = web3.utils.toWei(borrowAmt, "ether").toString();
    const interestRateMode = 1; // fixed rate
    const referralCode = "0";
    const onBehalfOf = myAddress;
    try {
      // Make the borrow transaction via LendingPool contract
      const lpAddress = await getLendingPoolAddress(web3)
      const lpContract = new web3.eth.Contract(LendingPoolABI.abi, lpAddress)
      await lpContract.methods
        .borrow(daiAddressKovan, daiAmountinWei, interestRateMode, referralCode, myAddress)
        .send({ from: myAddress })
        .catch((e) => {
          throw Error(`Error borrowing from the LendingPool contract: ${e.message}`)
        })
    } catch (e) {
      alert(e.message)
      console.log(e.message)
    }
  }

  /**
   * Repay an outstanding borrow with DAI - Note: User must have borrowed DAI
   */
  export const repay = async (web3, myAddress, repayAmt) => {
    console.log('in Repay: ');
    const daiAmountinWei = web3.utils.toWei(repayAmt, "ether").toString();
    const interestRateMode = 1; // fixed rate
    const onBehalfOf = myAddress;
    try {
      // Repay via LendingPool contract
      const lpAddress = await getLendingPoolAddress(web3)
      const lpContract = new web3.eth.Contract(LendingPoolABI.abi, lpAddress)
      await lpContract.methods
        .repay(daiAddressKovan, daiAmountinWei, interestRateMode, myAddress)
        .send({ from: myAddress })
        .catch((e) => {
          throw Error(`Error repaying in the LendingPool contract: ${e.message}`)
        })
    } catch (e) {
      alert(e.message)
      console.log(e.message)
    }
  }

  




  

