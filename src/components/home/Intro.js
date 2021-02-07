import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  heroGridItem: {
    padding: '0',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundImage: theme.customGradients.primary,
    height: '27em',
  },
  heroTitle: {
    color: 'white',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      width: theme.customValues.bigTitleWidth,
    },
  },
  heroSubTitle: {
    paddingTop: '1em',
    color: 'white',
    [theme.breakpoints.up('sm')]: {
      width: theme.customValues.bigTitleWidth,
    },
  },
  supportLink: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
    top: '0.25em',
  }
}));

const Intro = (props) => {
  const classes = useStyles();

  return (
    <Grid id="intro" item xs={12} style={{ padding: 0 }}>
      <div className={classes.hero}>
        <Typography className={classes.heroTitle} variant="h3">
          Refi Platform
          <br />
          with Credit Delegation
        </Typography>
        <Typography className={classes.heroTitle} variant="h3"></Typography>
        <Typography className={classes.heroSubTitle} variant="h6">
          <b>ReFi</b> is a decentalized refinance platform to avail reduced APR by leveraging credit delegation.
          The user buys Aave token by depositing DAI and can delegate its credit history to another account so that 
          the delegatee can refinance their loan from a centralized to DeFi platform at a lower interest rate.
          <a className={classes.supportLink} href='' 
          target="_blank" rel="noreferrer noopener"><br/>⚔️you are invited to join in our mission ⚔️</a> 
        </Typography>
      </div>
    </Grid>
  );
};

export default Intro;
