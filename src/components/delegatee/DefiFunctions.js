
// ABI imports
import ERC20ABI from '../../ABI/ERC20ABI.json'
import AaveTokenABI from '../../ABI/AToken.json'
import LendingPoolAddressProviderABI from '../../ABI/LendingPoolAddressProviderV1.json'
import LendingPoolABI from '../../ABI/LendingPoolV1.json'
import daiTokenABI from '../../ABI/dai.json'

//mainNet Addess
const aDaiAddressMain = "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d";
const daiAddressMain = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

//Kovan addresses:
const lpAddressProviderAddress = "0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5"
const wethAddress = "0xf8aC10E65F2073460aAD5f28E1EABE807DC287CF";
const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"; 
const aDaiAddressKovan = "0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a";
const aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";


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
    const lpAddressProviderContract = new web3.eth.Contract(LendingPoolAddressProviderABI, 
                            lpAddressProviderAddress);
    return lpAddressProviderContract;
 }

// Get the latest LendingPoolCore address
async function getLendingPoolCoreAddress(web3) {
    const lpCoreAddress = await getLendingPoolAddressProviderContract(web3)
      .methods.getLendingPoolCore()
      .call()
      .catch((e) => {
        throw Error(`Error getting lendingPool address: ${e.message}`)
      })
    console.log("LendingPoolCore address: ", lpCoreAddress)
    return lpCoreAddress
  }


/**
   * Deposit DAI into Aave to receive the equivalent AAVE DAI 
   * --Note: User must have DAI already in their wallet!
   */
export const deposit = async (web3, myAddress, depositAmt) => {
    console.log('in deposit');
    const daiAmountinWei = web3.utils.toWei(depositAmt, "ether").toString();
    const referralCode = "0";

    try {
        const lpCoreAddress = await getLendingPoolCoreAddress(web3)
  
        // Approve the LendingPoolCore address with the DAI contract
        const daiContract = new web3.eth.Contract(ERC20ABI, daiAddressKovan)
        await daiContract.methods
          .approve(lpCoreAddress, daiAmountinWei)
          .send({ from: myAddress })
          .catch((e) => {
            throw Error(`Error approving DAI allowance: ${e.message}`)
          })
  
        // Make the deposit transaction via LendingPool contract
        const lpAddress = await getLendingPoolAddress(web3)
        const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
        await lpContract.methods
          .deposit(daiAddressKovan, daiAmountinWei, referralCode)
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
    const interestRateMode = 2 // variable rate
    const referralCode = "0"

    try {
      // Make the borrow transaction via LendingPool contract
      const lpAddress = await getLendingPoolAddress(web3)
      const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
      await lpContract.methods
        .borrow(daiAddressKovan, daiAmountinWei, interestRateMode, referralCode)
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
    
    try {
      // Repay via LendingPool contract
      const lpAddress = await getLendingPoolAddress(web3)
      const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
      await lpContract.methods
        .repay(daiAddressKovan, daiAmountinWei, myAddress)
        .send({ from: myAddress })
        .catch((e) => {
          throw Error(`Error repaying in the LendingPool contract: ${e.message}`)
        })
    } catch (e) {
      alert(e.message)
      console.log(e.message)
    }
  }

  




  

