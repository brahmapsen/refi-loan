import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
//import Divider from '@material-ui/core/Divider';

import Intro from './Intro';
import HowItWorks from './HowItWorks';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: 'auto',
    textAlign: '-webkit-center',
  },
  titleBig: {
    width: theme.customValues.bigTitleWidth,
    color: 'black',
    fontWeight: '1000',
  },
  kovanText: {
    textAlign: 'center',
    color: 'red',
    width: '100%',
    marginBottom: '1em',
  },
  divider: {
    margin: '2em 0',
    width: 80,
    height: 4,
  },
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={6}>
      <Intro />
      <HowItWorks />
    </Grid>
  );
};

export default Home;

