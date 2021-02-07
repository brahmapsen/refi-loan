
import IAaveProtocolDataProviderABI from '../../abis/cd/IProtocolDataProvider.json'
import IDebtTokenABI from '../../abis/cd/IStableDebtToken.json'

const wethAddress = "0xf8aC10E65F2073460aAD5f28E1EABE807DC287CF";
const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"; 
const aDaiAddressKovan = "0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a";
const aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";

//mainNet Addess
const aDaiAddressMain = "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d";
const daiAddressMain = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

/**
 * 
 * Call Credit Delegate from contract
 */
export const callCreditDelegate = async (web3, account, network, delegateeAddress) => {
    console.log('delegateDeposit for account: ', account, ' in network ', network);
    // Get the Aave Protocol Data Provider
    const provider = new web3.eth.Contract(IAaveProtocolDataProviderABI.abi, account)

     // Relevant details for credit delegation
     const borrower = delegateeAddress ; //INSERT_BORROWER_ADDRESS
     const amountInWei =  web3.utils.toWei("1", "ether").toString();//INSERT_DELEGATED_AMOUNT
     
    // Get the relevant debt token address
    const tokenDetails = await provider.methods
        .getReserveTokensAddresses(daiAddressKovan)
        .call()
        .catch((e) => {
            throw Error(`Error getting token details: ${e.message}`)
        })

    // For stable debt tokens
    const stableDebtContract = new web3.eth.Contract(IDebtTokenABI.abi,
                               tokenDetails.stableDebtTokenAddress);
    await stableDebtContract.methods
        .approveDelegation(borrower, amountInWei)
        .send()
        .catch((e) => {
            throw Error(`Error approving delegation: ${e.message}`)
        })
    
}

