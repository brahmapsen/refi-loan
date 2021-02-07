import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.customValues.contentWidth,
    width: '100%',
    margin: 'auto',
  },
  flow: {
    justifyContent: 'center',
    marginBottom: '1em',
    width: '99%',
  },
  flowTitle: {
    padding: '0.5em',
    fontWeight: 900,
  },
  flowSubTitle: {
    color: '#797979',
  },
  numberIcon: {
    marginBottom: '2em',
  },
  subTitle: {
    color: '#797979',
    fontWeight: '600',
    letterSpacing: '0.2em',
    marginBottom: '2em',
    marginTop: '2em',
  },
  subTitleText: {},
  linkButton: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    marginTop: '2em'
  },
}));

const HowItWorks = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid id="how-it-works" item xs={12}>
        <Typography className={classes.subTitle} variant="subtitle2">
          HOW IT WORKS?
        </Typography>
      </Grid>

      <Grid container item spacing={3} className={classes.flow}>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Avatar className={classes.numberIcon}>1</Avatar>
          <img src="/assets/deposit.jpeg" alt="join a pool" />
          <Typography variant="h6" className={classes.flowTitle}>
            Deposit
          </Typography>
          <Typography variant="subtitle1" className={classes.flowSubTitle}>
            Buy Aave
          </Typography>
          <Typography variant="subtitle1" className={classes.flowSubTitle}>
            Earn interest and build up credit history
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Avatar className={classes.numberIcon}>2</Avatar>
          <img src="/assets/interest.png" alt="interest accrues" />
          <Typography variant="h6" className={classes.flowTitle}>
            Delegate Credit
          </Typography>
          <Typography variant="subtitle1" className={classes.flowSubTitle}>
            pass your credit history to another account through Credit Delegation feature of Aave
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Avatar className={classes.numberIcon}>3</Avatar>
          <img src="/assets/distribute.png" alt="Distribute" />
          <Typography variant="h6" className={classes.flowTitle}>
             Refinance!
          </Typography>
          <Typography variant="subtitle1" className={classes.flowSubTitle}>
            Delegatee can refinance their normal loan using Flashloan feature of Aave
          </Typography>
          <Typography variant="subtitle1" className={classes.flowSubTitle}>
            Sponsor credit history enables lower APR
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" className={classes.subTitleText}>
          <b>ReFi</b> leverages the Ethereum Network, it uses DAI, a dollar-pegged
          stablecoin, as a token of value, and it generates interest by lending
          the DAI using Aave. An account can pass their Credit History to another account.
          Uses Flashloan to refinance in one transaction.
          <br />
          Chainlink oracles identifies the best APR option.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          className={classes.linkButton}
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </Button>
      </Grid>
    </div>
  );
};

export default HowItWorks;
