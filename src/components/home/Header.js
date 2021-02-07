import React, { useEffect, useState } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { useStore } from "../../store/store";

import Address from '../../UI/Address';
import Web3 from 'web3';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    margin: 'auto',
  },
  appBar: {
    backgroundColor: 'white',
    height: 93,
    boxShadow: '0 0',
    borderBottom: 'solid 1px rgba(160,160,160,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    width: '85%',
  },
  logo: {
    paddingRight: '0.3em',
    cursor: 'pointer',
  },
  logo2: {
    paddingRight: '1em',
    cursor: 'pointer',
    height: 70,
  },
  logoText: {
    color: theme.customColors.text,
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.2em',
    paddingRight: '1.6em',
  },
  link: {
    color: theme.customColors.text,
    padding: '0 0.8em',
    textDecoration: 'none',
    fontWeight: '500',
  },
  linkActive: {
    color: theme.palette.primary.main,
  },
  divider: {
    flexGrow: 1,
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
  },
  googleLogin: {
    borderRadius: 50,
    overflow: 'hidden',
    height: 52,
    border: '1px solid rgba(160,160,160,0.2);',
  },
  walletButton: {
    borderRadius: 50,
    marginRight: '1em',
    background: 'white',
    color: theme.customColors.text,
    height: 52,
    width: 165,
    boxShadow: 'none',
    border: '1px solid rgba(160,160,160,0.2);',
    textTransform: 'none',
  },
  walletIcon: { paddingLeft: '0.3em' },
  userDetails: {
    cursor: 'pointer',
  },
}));

const Header = (props) => {

  //const store = useStore();
  const { state, dispatch } = useStore();
  const classes = useStyles();

  let web3;
  let account = "";
  let modals = state.modals;

  const [anchorElement, setAnchorElement] = useState(null);
  const [walletAnchorElement, setWalletAnchorElement] = useState(null);
  const [walletsModalOpen, setWalletsModalOpen] = useState(true);
  
  const onWalletClick = async (event) => {
    if (!props.address) {
      // open wallets modal
      if(!walletsModalOpen){
        setWalletsModalOpen(true);
      }
    } else {
      // open menu
      setWalletAnchorElement(event.currentTarget);
    }
  };

  const setWeb3Provider = (provider) => web3.setProvider(provider);

  const onWalletDisconnet = () => {
    props.onWalletConnect(null); // set address in redux global state
    setWeb3Provider(null); // reset web3 provider
  };

  const handleClickAvatar = (event) => {
    setAnchorElement(event.currentTarget);
  };

// event handler for google signin
const onSignIn = (googleUser) => {
  const tokenId = googleUser.getAuthResponse().id_token;

  if (tokenId) {
    // send the token id to backend and update state
    window
      .fetch('http://localhost:3000/login/google', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ tokenId }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        const profile = googleUser.getBasicProfile();

        const userDetails = {
          token: data.token,
          userId: profile.getId(),
          name: profile.getGivenName(),
          imageUrl: profile.getImageUrl(),
        };

        props.onSignInSuccess(userDetails); // dispatch to update state
      });
  }
};

// event handler for google signin failure
const onFailure = (error) => {
  console.log('FAILED TO SIGN IN', error);
};

useEffect(() => {
  async function getAccount() {
    let wallet="Metamask"
    if(window.ethereum){
      console.log("Header.js --> useEffect-->getAccount() ......")
      modals.connectionPending = true;
      dispatch({ type: "setWallet", wallet });
      dispatch({ type: "setModals", modals });
  
      web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      window.web3 = web3;
      // set account
      account = (await web3.eth.getAccounts())[0];
      //set network ID
      const network = await web3.eth.net.getId();

      dispatch({ type: "setAccount", account });
      dispatch({ type: "setNetwork", network });
      dispatch({ type: "setWeb3", web3 });
  
      modals.connectionPending = false;
      dispatch({ type: "setModals", modals });
    }
    else {
      window.alert('Header.js:useEffect(): Non-Ethereum browser detected. Install MetaMask!')
    }
  }
  getAccount()
  
}, []);


const googleSigninButton = (
  <div id="signinButton" className={classes.googleLogin} />
);

const userAvatar = (
  <div onClick={handleClickAvatar} className={classes.userDetails}>
    <Avatar alt={props.name} src={props.imageUrl} />
  </div>
);

const authArea = (
  <div className={classes.authArea}>
    <Button
      className={classes.walletButton}
      onClick={onWalletClick}
      variant="outlined"
      size="small"
    >
      {props.address ? (
        <Address address={props.address} />
      ) : (
        <>
          Connect Wallet
          <AccountBalanceWalletIcon color="primary" className={classes.walletIcon} />
        </>
      )}
    </Button>
    
  </div>
);

  return (
  <div className={classes.root}>
    <AppBar className={classes.appBar} position="static" color="secondary">
      <Toolbar className={classes.toolbar}>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <img src="./assets/crowdsourcing.jpeg" alt="crowdplat" className={classes.logo2} />
        <Typography variant="h5" className={classes.logoText} onClick={() => props.history.push('/')} >
            ReFi
        </Typography>

        <NavLink className={classes.link} to="/" activeClassName={classes.linkActive} >
            Home
        </NavLink>
        
        <NavLink className={classes.link} to="/dashboard" activeClassName={classes.linkActive}>
            Dashboard
        </NavLink>

        <NavLink className={classes.link} to="/creditor" activeClassName={classes.linkActive} >
            Creditor
        </NavLink>

        <NavLink className={classes.link} to="/delegatee" activeClassName={classes.linkActive} >
            Delegatee
        </NavLink>

        <NavLink className={classes.link} to="/refinance" activeClassName={classes.linkActive} >
            Refinance
        </NavLink>
       
        <div className={classes.divider}>

        </div>

        {authArea}

        <Menu
          id="wallet-menu"
          anchorEl={walletAnchorElement}
          keepMounted
          open={Boolean(walletAnchorElement)}
          onClose={() => {
            setWalletAnchorElement(null);
          }}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          >
          <MenuItem
            onClick={() => {
              onWalletDisconnet(); // disconnect
              setWalletAnchorElement(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    
  </div>

  );

}
export default withRouter(Header);

