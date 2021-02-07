import {useState, useEffect} from 'react';
import MyV2CreditDelegation from "../../abis/MyV2CreditDelegation.json"
import { useStore } from "../../store/store";

const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";

/**
 * 
 * Call Credit Delegate from contract
 */
export const callCreditDelegate = async (delegateeAddress) => {
    console.log('Call Credit Delegate');
    const store = useStore();
    const {
        web3,
        account,
    } = store.state;

    const [myV2CreditDelegation, setMyV2CreditDelegation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [daiAmount, setDaiAmount] = useState('')

    const [state, setState] = useState({
        error: '',
        success: ''
    });

    useEffect(() => {
        async function getAccount() {
        if (!store.state.web3) {
            alert("Dashboard.js: web3 provider is NOT set up with the browser.")
        }
        else {
            const networkId = await web3.eth.net.getId();
            const myV2CreditDelegationData = MyV2CreditDelegation.networks[networkId];
            if (myV2CreditDelegationData) {
                const myV2CreditDelegation = new web3.eth.Contract(MyV2CreditDelegation.abi,myV2CreditDelegationData.address);
                setMyV2CreditDelegation(myV2CreditDelegation);
            } else {
                window.alert("MyV2CreditDelegation contract not deployed to detected network.");
            }

        }
        }
        getAccount()
        delegateCredit(delegateeAddress, "1")
    
    }, [])

    //execute Loan
    const delegateCredit = (delegateeAddress, creditAmount) => {
        console.log('CALL Credit Delegate');
        const daiAmountinWei = web3.utils.toWei(creditAmount, "ether").toString();
        try {
            setLoading(true);
            myV2CreditDelegation.methods
            .approveBorrower(delegateeAddress, daiAmountinWei, daiAddressKovan)
            .send({ from: account })
            .on("transactionHash", (hash) => {
                setLoading(false);
            });
        } catch (error){
            console.log(error);
            setLoading(false);
            setState({...state,  error: error.response.data.error})
        }
    };

    
}

