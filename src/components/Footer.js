import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '8em',
    background: '#363841',
    height: 70,
  },
  logosDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '0.7em',
    width: '60%',
    margin: 'auto',
  },
  text: {
    padding: '0.5em',
    color: '#969AA6',
  },
  logo: {
    width: 30,
    height: 30,
    padding: '0.5em',
  },
}));

const Footer = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div id="logos" className={classes.logosDiv}>
        <Typography variant="subtitle2" className={classes.text}>
          © 2021 ReFi
        </Typography>
        <div>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src="./assets/discord.png"
              alt="discord logo"
              className={classes.logo}
            ></img>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src="./assets/instagram.svg"
              alt="instagram logo"
              className={classes.logo}
            ></img>
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src="./assets/twitter.svg"
              alt="twitter logo"
              className={classes.logo}
            ></img>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
