import React, {useState, useEffect}  from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

import Colors from '../constants/colors';
import Settings from './Settings';

// Header Main Function #########################################################################

const Header = props => {

  const [settings, setSettings] = useState (false);
  const [navigation, setNavigation] = useState(); 

  let sideMenu, settingMenu, x;

// Header Lifetime Checks ########################################################################

  useEffect(() => {
    if (navigation === 0) {
      props.onSwitchNavi([0, false, false ]);
    } else if (navigation === 1) {
      props.onSwitchNavi([1, false, false]);
    } else if (navigation === 2) {
      props.onSwitchNavi([2, false, false ]);
    }
  });

// Header Hhelping funcions ######################################################################
  
  const openSettings  = () => {if (props.status > 0) setSettings(true)};
  const closeSettings = () => setSettings(false);

  const navHandler    = value => {
    if (value === true && props.status  > 1 ) setNavigation(props.status-1);
    else setNavigation(value);
    setTimeout(() => {setNavigation()}, 100);
  };

  const saveDatas = (eroef, inBear, erled, angeb, versch, gewonn, verlor ) => {
    props.user.filter.eroef = eroef;
    props.user.filter.inBear = inBear;
    props.user.filter.erled = erled;
    props.user.filter.angeb = angeb;
    props.user.filter.versch = versch;
    props.user.filter.gewonn = gewonn;
    props.user.filter.verlor = verlor;
    setSettings(false);
  };
 
  const navLogoutHandler = () => {
    setSettings(false);
    Alert.alert(
      'Achtung!', 
      'Ihre Sitzung wird beendet und sie gelangen zum login', 
      [{text: 'Ja, bitte Ausloggen', style: 'destructive', onPress: navHandler.bind(this, 0) }]                
    );
  };

// Header Cont Functions #########################################################################

  if (settings && props.status > 0) {
    settingMenu = <Settings
      menuLog     = {'Eingeloggt Als:'}
      menuName    = {props.user.mAKlar}
      menuNameId  = {'ID - ' + props.user.mANr}
      menuLogout  = {navLogoutHandler}
      setClose    = {closeSettings}
      filter      = {props.user.filter}
      saveDatas   = {saveDatas}
    />;
  } else {
    settingMenu = <View></View>
  };

// Header Return #################################################################################
  
  return (
    <View>
      <View style={styles.headerTop}>
      </View>
      <View style={styles.headerNavi}>
        <TouchableOpacity style={styles.box} onPress={navHandler.bind(this, 1)}>
          <Text>Logo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={navHandler.bind(this, true)}>
          <Text>{props.status}</Text>
        </TouchableOpacity>
        <View style={styles.boxTitle}>
          <View style ={styles.boxTitleText} >
            <Text style={styles.headerTitle}>{props.title}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.box} >
          <Text>sync</Text>        
        </TouchableOpacity> 
        <TouchableOpacity style={styles.box} onPress={openSettings}>
          <Text>...</Text>        
        </TouchableOpacity>      
      </View>
      {sideMenu}
      {settingMenu}
    </View>
  );
};

//Header Style ###################################################################################

const styles = StyleSheet.create({
  headerTop: {
    width: '100%',
    height: 20,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  headerNavi: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: 'black',
    fontSize: 18
  },
  box: {
    width: '12%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5
  },
  boxTitle: {
    padding: 5,
    width: '52%',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  boxTitleText: {
    width: '90%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5, 
  }
});

export default Header;