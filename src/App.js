import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Home from "./components/home/Home"
import Refinance from './components/refinance/Refinance'
import Creditor from './components/creditor/Creditor';
import Header from "./components/home/Header"
import Dashboard from './components/dashboard/Dashboard';
import Delegatee from './components/delegatee/Delegatee';
import Footer from './components/Footer';
import { StoreProvider } from "./store/store";

const useStyles = makeStyles((theme) => ({
  app: {
    background: theme.customColors.background,
  },
  content: {
    minHeight: '100vh',
  },
}));

const App = (props) => {
  const classes = useStyles();
  return (
    <StoreProvider>
      <BrowserRouter>
          <div className={classes.app}>
            <div className={classes.content}>
              <Header />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/creditor" exact component={Creditor} />
                <Route path="/dashboard" exact component={Dashboard} />
                <Route path="/delegatee" exact component={Delegatee} />
                <Route path="/refinance" exact component={Refinance} />
              </Switch>
            </div>
            <Footer />
          </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;

