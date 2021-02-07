import React, {useState, useEffect} from 'react'
import RefiPolicy from "../../abis/RefiPolicy.json";
import { useStore } from "../../store/store";

let id = 0
let id2 = 0

const Dashboard = props => {

  const store = useStore();
  const {
    web3,
    account,
    network
  } = store.state;

  const [loading, setLoading] = useState(true)
  const [totalAaveToken, setTotalAaveToken] = useState(0)
  const [totalDonation, setTotalDonation] = useState(0)
  const [delegatee, setDelegatee] = useState([])
  const [loanAmount, setLoanAmount] = useState(100)
  const [refiPolicy, setRefiPolicy] = useState(null)

  const [depositors, setDepositors] = useState([])
  const [aaveDepositAmount, setAaveDepositAmount] = useState(3000)
  

  useEffect(() => {
    async function getAccount() {
      if (!web3) {
        alert("Dashboard: web3 provider is NOT set up with the browser.")
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
        // //get total aave token  --totalAaveToken
        // try {
        //   _refiPolicy.methods.totalAaveToken().call((err, result) => { 
        //     const _totalAaveToken = web3.utils.fromWei(result, 'ether')
        //     setTotalAaveToken(_totalAaveToken);
        //   }); 
        // } catch (e) {
        //   alert(e.message)
        // }
      }
    }
    getAccount()
  }, [])

  // Get the depositors list
  const getDepositors = () => {
    if(!loading) setLoading(true);
    try {               
      refiPolicy.methods.getDepositors().call((err, result) => { 
          setDepositors(result);
      }); 
    } catch (e) {
      alert("getDepositors: " + e.message)
    }
    setLoading(false);
  };
  const CreditorItem = (props) => {
    return(
      <tr>
        <td>{props.address} </td>
      </tr>
    )
  }

  // Get the delegatee list
  const getDelegatee = () => {
    //setLoading(true);
    try {               
      refiPolicy.methods.getDelegatee(account).call((err, result) => { 
          setDelegatee(result);
      }); 
    } catch (e) {
      alert("getDelegatee: " + e.message)
    }
    //setLoading(false);
  };
  const DelegateeItem = (props) => {
    return(
      <tr>
        <td> {props.account} </td>
        <td> {props.creditAmount} </td>
        <td> <input type="checkbox" checked={props.chkbox} 
              onChange={ (id) => id.checked = !id.checked}
              /> 
        </td>
      </tr>
    )
  }

  return (
      <div id="content" className="mt-3">
        <div className="col-md-6 offset-md-3">
        &nbsp;&nbsp;
          <h1>Admin  view</h1>
          <button className="btn btn-primary btn-lg"
                  onClick={getDepositors}
          >
                Credit History Delegator List
          </button> 
          <table className="table table-borderless text-muted text-center">
            <thead>
              <tr>
                <th scope="col">Account Address </th>
              </tr>
            </thead>
            <tbody>
              {
                depositors.map( account => 
                  <CreditorItem key={id2++} address = {account} 
                  />
                )
              }
            </tbody>
          </table>
        </div>

        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
        <div className="col-md-6 offset-md-3">
            &nbsp;&nbsp;
          <button className="btn btn-primary btn-lg"
                  onClick={getDelegatee}
          >
                Credit Delegation Details
          </button> 
          <table className="table table-borderless text-muted text-center">
            <thead>
              <tr>
                <th scope="col">Account Address </th>
                <th scope="col">Credit Limit</th>
                <th scope="col">Valid</th>
              </tr>
            </thead>
            
            <tbody>
                  {
                     delegatee.map( account => 
                        <DelegateeItem key={id++} account={account} 
                                      creditAmount="50000" 
                                      chkbox = {true}
                        />
                    )
                }
            </tbody>

          </table>
        </div>

        
          
      </div>
    );

}

export default Dashboard;