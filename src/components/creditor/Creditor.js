import React, {useState, useEffect} from 'react'
import RefiPolicy from "../../abis/RefiPolicy.json";
import MyV2CreditDelegation from "../../abis/MyV2CreditDelegation.json"
import { useStore } from "../../store/store";
import { callCreditDelegate } from './creditDelegate-web3';
import { deposit } from '../defifuncs/DefiFunctions';

import ERC20ABI from "../../ABI/ERC20ABI.json";

import clinkImage from "../../icons/chainlink.png";
import wethImage from "../../icons/weth.png";
import daiImage from "../../icons/dai.png";

const linkAddressKovan = "0xAD5ce863aE3E4E9394Ab43d4ba0D80f419F61789";
const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
//const aDaiAddressKovan = "0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a";
const aDaiAddressKovan = '0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8';


const Creditor = props => {

  const store = useStore();
  const { web3, account, network } = store.state;

  const [loading, setLoading] = useState(true)
  const [refiPolicy, setRefiPolicy] = useState(null)
  const [myV2CreditDelegation, setMyV2CreditDelegation] = useState(null)
  const [delegateeAddress, setDelegateeAddress] = useState(null)
  const [delegateAmount, setDelegateAmount] = useState(0)
  const [aaveBalance, setAaveBalance] = useState('')
  const [erc20Balance, setErc20Balance] = useState('')
  const [tokenImage, setTokenImage] = useState(null);
  const [tokenName, setTokenName]  = useState('');
  const [tokenValue, setTokenValue] = useState('')
  
  const [state, setState] = useState({
    error: '',
    success: ''
  });

 
  useEffect(() => {
    async function getAccount() {
      if (!web3) {
        alert("Creditor: web3 provider is NOT set up with the browser.")
      }
      else {
        console.log('Creditor.js: Get Policy Data References')
        const refiPolicyData = RefiPolicy.networks[network];
        let _refiPolicy ;
        if (refiPolicyData) {
            _refiPolicy = new web3.eth.Contract(RefiPolicy.abi,refiPolicyData.address);
            setRefiPolicy(_refiPolicy);
        } else {
          window.alert("RefiPolicy contract not deployed to detected network.");
        }

        const myV2CreditDelegationData = MyV2CreditDelegation.networks[network];
        if (myV2CreditDelegationData) {
            const myV2CreditDelegation = new web3.eth.Contract(MyV2CreditDelegation.abi,myV2CreditDelegationData.address);
            setMyV2CreditDelegation(myV2CreditDelegation);
        } else {
            console.log("MyV2CreditDelegation contract not deployed to detected network.");
        }

        setTokenName("WETH");
        await web3.eth.getBalance(account, (err, _ethBalance) => {
          setErc20Balance(web3.utils.fromWei(_ethBalance, 'ether'));
        });
        setTokenImage(wethImage);

        //update aDAI balance
        updateADAIBalance();
        
      }
    }
    getAccount()
    }, []);

    
    const addDelegatee = async e => {
        const daiAmountinWei = web3.utils.toWei(delegateAmount, "ether").toString();
        await callCreditDelegate(web3, account, network, 
                                 delegateeAddress, daiAmountinWei);
        // try {
        //     setLoading(true);
        //     myV2CreditDelegation.methods
        //     .approveBorrower(delegateeAddress, daiAmountinWei, daiAddressKovan)
        //     .send({ from: account })
        //     .on("transactionHash", (hash) => {
        //         setLoading(false);
        //     });
        // } catch (error){
        //     alert(error);
        //     setLoading(false);
        //     setState({...state,  error: error.response.data.error})
        // }

        // try {
        //     e.preventDefault();
        //     setLoading(true);

        //     refiPolicy.methods
        //     .addDelegatee(account,delegateeAddress)
        //     .send({ from: account })
        //     .on("transactionHash", (hash) => {
        //         setLoading(false);
        //      });

        //   } catch (error){
        //     console.log(error);
        //     setState({...state,  error: error.response.data.error})
        // }

    }

    const changeToken = async (tokenImage, tokenName )=> {
      setTokenImage(tokenImage);
      setTokenName(tokenName);
      updateBalance(tokenName);
    }

    const updateBalance = async (tokenName) => {
          let erc20 ;
          if (tokenName === 'WETH') {
             await web3.eth.getBalance(account, (err, _ethBalance) => {
                setErc20Balance(web3.utils.fromWei(_ethBalance, 'ether'));
             });
          } else if (tokenName === 'DAI'){
            erc20 = new web3.eth.Contract(ERC20ABI, daiAddressKovan);
            await erc20.methods.balanceOf(account).call(
              (err, _ethBalance) => {
                setErc20Balance(web3.utils.fromWei(_ethBalance, 'ether'));
             });
          } 
          else if (tokenName === 'LINK') {
            erc20 = new web3.eth.Contract(ERC20ABI, linkAddressKovan);
            await erc20.methods.balanceOf(account).call(
              (err, _ethBalance) => {
                setErc20Balance(web3.utils.fromWei(_ethBalance, 'ether'));
             });
          }
          
    }

    const updateADAIBalance = async () => {
      const erc20 = new web3.eth.Contract(ERC20ABI, aDaiAddressKovan);
      await erc20.methods.balanceOf(account).call(
        (err, _ethBalance) => {
          setAaveBalance(web3.utils.fromWei(_ethBalance, 'ether'));
       });
   }

   const depositAsset = (account, tokenValue) => {
         deposit(web3, account, tokenValue)
   }


  return (
    <div className="col-md-6 offset-md-3">
        <h1>Creditor </h1>
        <br/>
        <div>
            <p><b>Creditor Address:</b> {account}</p>
        </div>
        &nbsp;&nbsp;

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staked AAVE Token </th>
              <th scope="col">Interest Accrued </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                { aaveBalance } 
              </td>
              <td>
                    ".396"
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
              <div>
                <label className="float-left">
                  <b>Tokens available in wallet</b>
                </label>
                <span className="float-right text-muted">
                  {erc20Balance}
                </span>
              </div>
              <br/>

              <div className="input-group mb-4">
                <input onChange = { e=> setTokenValue(e.target.value)}
                  value = { tokenValue } type="Text"
                  className="form-control form-control-lg" placeholder="" required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={tokenImage} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; {tokenName}
                  </div>
                </div>
              </div>

              <div className="input-group mb-4">
                  <input type="button" id="link"  name="token" value="LINK"
                    onClick={(event) => {
                      event.preventDefault();
                      changeToken(clinkImage, "LINK");
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="button" id="dai" name="token" value="DAI"
                      onClick={(event) => {
                      event.preventDefault();
                      changeToken(daiImage, "DAI");
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="button" id="weth" name="token" value="WETH"
                      onClick={(event) => {
                      event.preventDefault();
                      changeToken(wethImage, "WETH");
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="button" id="aave" name="token" value="Deposit DAI for AAVE"
                      onClick={(event) => {
                      event.preventDefault();
                      depositAsset( account, tokenValue);
                      updateADAIBalance();
                    }}
                  />
                  
              </div>

              </div>
              </div>

        <div className="form-group">
            <label>Enter Delegatee Address: </label>
            <input value={delegateeAddress} 
                   onChange={ e => setDelegateeAddress(e.target.value)}
                   className="form-control" placeholder=""  required />
        </div>
        <div className="form-group">
            <label>Enter Delegate Amount: </label>
            <input value={delegateAmount} 
                   onChange={ e => setDelegateAmount(e.target.value)}
                   className="form-control" placeholder=""  required />
        </div>
        <div className="form-group">
            <button className="btn btn-outline-warning" onClick={addDelegatee}>Add Credit Delegatee</button>
        </div>

    </div>
  );

}

export default Creditor;