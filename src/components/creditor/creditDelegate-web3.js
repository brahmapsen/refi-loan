
import ProtocolDataProviderABI from '../../abis/ProtocolDataProvider.json'
import DebtTokenABI from '../../abis/DebtToken.json';

const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"; 
const protocolDataProviderAddress = '0x3c73A5E5785cAC854D468F727c606C07488a29D6';

/**
 * Call Credit Delegate from contract
 */
export const callCreditDelegate = async (web3, account, network, 
                                         delegateeAddress, daiAmountinWei) => {
    // Get the Aave Protocol Data Provider
    const provider = new web3.eth.Contract(ProtocolDataProviderABI, 
                         protocolDataProviderAddress);
    const borrower = delegateeAddress ;
     
    // Get the relevant debt token address
    const tokenDetails = await provider.methods
        .getReserveTokensAddresses(daiAddressKovan)
        .call()
        .catch((e) => {
            throw Error(`Error getting token details: ${e.message}`)
        })

    // For stable debt tokens
    const stableDebtContract = new web3.eth.Contract(DebtTokenABI,
                               tokenDetails.stableDebtTokenAddress);
    
    //aprove delegation
    await stableDebtContract.methods
        .approveDelegation(borrower, daiAmountinWei)
        .send({from: account})
        .catch((e) => {
            throw Error(`Error approving delegation: ${e.message}`)
            })
    
}

