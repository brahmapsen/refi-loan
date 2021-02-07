import React, {useState, useEffect} from 'react'

import RefiPolicy from "../../abis/RefiPolicy.json";
import { useStore } from "../../store/store";
import { borrow, repay } from './DefiFunctions';

export default (props) => {

  const store = useStore();
  const {
    web3,
    account,
  } = store.state;

  const [refiPolicy, setRefiPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [daiAmount, setDaiAmount] = useState('')

  useEffect(() => {
    async function getAccount() {
      if (!store.state.web3) {
        alert("Dashboard.js: web3 provider is NOT set up with the browser.")
      }
      else {
        // const networkId = await web3.eth.net.getId();
        // const refiPolicyData = RefiPolicy.networks[networkId];
        // if (refiPolicyData) {
        //     const refiPolicy = new web3.eth.Contract(RefiPolicy.abi,refiPolicyData.address);
        //     setRefiPolicy(refiPolicy);
        // } else {
        //   window.alert("RefiPolicy contract not deployed to detected network.");
        // }
      }
    }
    
    getAccount()
   
  }, [])


  //Borrow
  const borrowAmount = () => {
    borrow(web3, account,daiAmount)
  };

  const repayAmount = () => {
        repay(web3, account,daiAmount)
  };

  // const borrowAmount = () => {
  //   //if(!loading) setLoading(true);
  //   refiPolicy.methods.registerBorrower()
  //     .send({ from: account })
  //     .on("transactionHash", (hash) => {
  //       //setLoading(false);
  //     });
  // };



    return (
        <div id="content" className="mt-3">
            &nbsp;
            <div className="col-md-6 offset-md-3">
              <p><b>Lender Address:</b> {account}  
                &nbsp; &nbsp; &nbsp;
                <input type="checkbox" 
                       onChange={ (id) =>  id.checked = !id.checked }
                /> &nbsp;  Credit Delegated
              </p>
              <hr/>
            </div>
            
            &nbsp;

            <div className="col-md-6 offset-md-3">
            <h1>Borrow and Repay </h1>&nbsp;&nbsp;
                <label>Enter Amount: </label>
                <input className="form-control"  value={daiAmount} 
                       onChange={ e => setDaiAmount(e.target.value)}
                       type="text" 
                       placeholder="dai amount"  required />

             
              <button className="btn btn-primary btn-lg" onClick={borrowAmount}>Borrow</button> 
              &nbsp;&nbsp;
              <button className="btn btn-primary btn-lg" onClick={repayAmount}>Repay</button>
            </div>

        </div>
      );

}