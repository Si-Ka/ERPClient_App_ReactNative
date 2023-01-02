import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';

import Header from './components/Header';
import BasicStuff from './data/basicStuff';
import LoginScreen from './screens/LoginScreen';
import CustomerScreen from './screens/CustomerScreen';
import ProcessesScreen from './screens/ProcessesScreen';
import DetailScreen from './screens/DetailScreen';
import User from './data/user';
import Customer from './data/customer';
import Vorgang from './data/vorgang';
import Details from './data/details';


// Master Function Start ################################################################################################################

export default function App() { 

  const [settings, setSettings] = useState(new BasicStuff);
  const [user, setUser] = useState(new User);
  const [navigation, setNavigation] = useState(0);    
  const [custList, setCustList] = useState([]);  
  const [procList, setProcList] = useState([]);
  const [detList, setDetList] = useState([]);
  const [vor, setVor] = useState();
  const [cust, setCust] = useState();
  
  

  let content, naviScreen; 

// Master Function help Functions Start #################################################################################################

  const custSearch = searchVal => Customer.customerHandler(user, searchVal, settings, custList, 0);

  const navigationHandler = props => {
    if (user.logStat === false || props[0] === 0) {
      setNavigation(0);
      setSettings(new BasicStuff);
      setUser(new User);
      setCustList([]);
      setProcList([]);
      setDetList([]);
      setCust();
      setVor();
    } else if (user.logStat === true && props[0] === 1) {
      settings.loadProc = true;
      settings.getProc = false; 
      detList.length = 0;      
      setNavigation(1);
    } else if (user.logStat === true && props[0] === 2 ) {      
      if (props[1] === true) {               
        Vorgang.getProcess(user.sesID, props[2].kundeNr, settings, procList, 0);
        settings.getProc = true;
        settings.loadProc = false;
        setCust(props[2]);  
      } else if (props[1] === false) {
        detList.length = 0;
        settings.loadDet = true;
        settings.getDet = false;
      };
      setNavigation(2);
    } else if (user.logStat === true && props[0] === 3 ) {
      setNavigation(3);
      if (props[1] === true) {
        settings.getDet = true;
        settings.loadDet = false;
        Details.getDetails(user.sesID, props[2].vorgID, settings, detList, 0);
        setVor(props[2])
      };
    };
  };
  
// Master Function Cont Choice ########################################################################################################

  if (user.logStat === false || navigation === 0){
    naviScreen = 'Login';
    content = <LoginScreen 
      onLogin       = {navigationHandler}
      user          = {user}
      settings      = {settings}
    />;
  } else if (user.logStat === true && navigation === 1) {
    naviScreen = 'Kundenübersicht';
    content = <CustomerScreen 
      onSwitchNavi  = {navigationHandler}
      custList      = {custList}
      onSearch      = {custSearch}
      user          = {user}
      settings      = {settings}
      procList      = {procList}
    />;
  } else if (user.logStat === true && navigation === 2) {
    naviScreen = 'Vorgangsübersicht';
    content = <ProcessesScreen 
      onSwitchNavi  = {navigationHandler} 
      knd           = {cust}
      vorg          = {procList}
      user          = {user}
      settings      = {settings}
    />;
  } else if (user.logStat === true && navigation === 3) {
    naviScreen = 'Detailübersicht';
    content = <DetailScreen 
      onSwitchNavi  = {navigationHandler}
      knd           = {('Kunden ID: ' + cust.kundeNr + ' | ' + cust.name1)}
      vor           = {vor}
      detList       = {detList}
      user          = {user}
      settings      = {settings}
    />;
  }
  
// Master Function Return ############################################################################################################

  return (    
    <View style={styles.screen}>
      <Header 
        title         = {naviScreen} 
        status        = {navigation}
        onSwitchNavi  = {navigationHandler}
        user          = {user}
      /> 
      {content}  
    </View>
  );
}

// Master Function Style ###########################################################################################################

const styles = StyleSheet.create({
  screen: {
    flex: 1
  } 
});