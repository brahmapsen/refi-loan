import React, {useState, useEffect} from 'react'
import RefiPolicy from "../../abis/RefiPolicy.json";
import MyV2CreditDelegation from "../../abis/MyV2CreditDelegation.json"
import { useStore } from "../../store/store";
//import { callCreditDelegate } from './creditDelegate';
import { deposit } from '../delegatee/DefiFunctions';

import ERC20ABI from "../../ABI/ERC20ABI.json";
import AaveTokenABI from '../../ABI/AToken.json'

import clinkImage from "../../icons/chainlink.png";
import wethImage from "../../icons/weth.png";
import daiImage from "../../icons/dai.png";

//account 3 as delegatee address
const delegateeAddress = "0x3166B6c178fB401b6DE3FA0a9D9A15A881125495";

const linkAddressKovan = "0xAD5ce863aE3E4E9394Ab43d4ba0D80f419F61789";
const daiAddressKovan = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
const aDaiAddressKovan = "0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";

const Creditor = props => {

  const store = useStore();
  const {
    web3,
    account,
    network
  } = store.state;

  const [loading, setLoading] = useState(true)
  const [refiPolicy, setRefiPolicy] = useState(null)
  const [myV2CreditDelegation, setMyV2CreditDelegation] = useState(null)
  const [delegateeAddress, setDelegateeAddress] = useState(null)
  const [aaveBalance, setAaveBalance] = useState(400)
  const [erc20Balance, setErc20Balance] = useState('')
  const [tokenImage, setTokenImage] = useState(null);
  const [tokenName, setTokenName]  = useState('');
  const [tokenValue, setTokenValue] = useState('')
  
  const [state, setState] = useState({
    error: '',
    success: ''
  });

  const updateADAIBalance = async () => {
      const erc20 = new web3.eth.Contract(ERC20ABI, aDaiAddressKovan);
      await erc20.methods.balanceOf(account).call(
        (err, _ethBalance) => {
          setAaveBalance(web3.utils.fromWei(_ethBalance, 'ether'));
       });
  }

  useEffect(() => {
    async function getAccount() {
      if (!web3) {
        alert("Creditor: web3 provider is NOT set up with the browser.")
      }
      else {
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
          }, 
    []);

    const delegateCredit = (creditAmount) => {
        alert('CALL Credit Delegate');
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
            alert(error);
            setLoading(false);
            setState({...state,  error: error.response.data.error})
        }
    };

    const addDelegatee = async e => {
      delegateCredit("1");
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

  const loginForm = () => (
    <form onSubmit={addDelegatee}>
        <div className="form-group">
            <label>Enter Delegatee Address: </label>
            <input value={delegateeAddress} 
                   onChange={ e => setDelegateeAddress(e.target.value)}
                   type="text" 
                   className="form-control" placeholder="delegatee address"  required />
        </div>
        <div className="form-group">
            <button className="btn btn-outline-warning">Add Credit Delegatee</button>
        </div>
    </form>
  );

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
                      deposit(web3, account, tokenValue);
                      updateADAIBalance();
                    }}
                  />
                  
              </div>

              </div>
              </div>

        {loginForm()}
    </div>
  );

}

export default Creditor;