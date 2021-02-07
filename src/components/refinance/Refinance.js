import React, {useState, useEffect} from 'react'
//import RefiPolicy from "../../abis/RefiPolicy.json";
import MyV2FlashLoan from "../../abis/MyV2FlashLoan.json"
import { useStore } from "../../store/store";


export default (props) => {

  const store = useStore();
  const {
    web3,
    account,
  } = store.state;

  //const [refiPolicy, setRefiPolicy] = useState(null)
  const [myV2FlashLoan, setMyV2FlashLoan] = useState(null)
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
        // const networkId = await web3.eth.net.getId();
        // const refiPolicyData = RefiPolicy.networks[networkId];
        // if (refiPolicyData) {
        //     const refiPolicy = new web3.eth.Contract(RefiPolicy.abi,refiPolicyData.address);
        //     setRefiPolicy(refiPolicy);
        // } else {
        //   window.alert("RefiPolicy contract not deployed to detected network.");
        // }

        const networkId = await web3.eth.net.getId();
        const myV2FlashLoanData = MyV2FlashLoan.networks[networkId];
        if (myV2FlashLoanData) {
            const myV2FlashLoan = new web3.eth.Contract(MyV2FlashLoan.abi,myV2FlashLoanData.address);
            setMyV2FlashLoan(myV2FlashLoan);
        } else {
          window.alert("MyV2FlashLoan contract not deployed to detected network.");
        }

      }
    }
    
    getAccount()
   
  }, [])


  //execute Loan
  const executeLoan = (e) => {
      console.log('CALL Flashloan');
      try {
        e.preventDefault();
        setLoading(true);

        myV2FlashLoan.methods
        .myFlashLoanCall()
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

  return (
      <div id="content" className="mt-3">
          <div className="col-md-6 offset-md-3">
          <h1>FlashLoan </h1>&nbsp;&nbsp;
              <label>Enter Amount: </label>
              <input className="form-control"  value={daiAmount} 
                      onChange={ e => setDaiAmount(e.target.value)}
                      type="text" 
                      placeholder="dai amount"  required />
              <button className="btn btn-primary btn-lg" 
                      onClick={executeLoan}>Execute Flash Loan</button> 
          </div>

      </div>
      );

}