import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';

import Card from '../components/Card';
import PrestentTile from '../components/PresentTile';
import EditMenu from '../components/EditMenu';
import Vorgang from '../data/vorgang';
import BasicStuff from '../data/basicStuff';

// Screen Main Function ###############################################################################

const ProcessesScreen = props => { 

  const [navigation, setNavigation] = useState(2);
  const [list, setList] = useState([]);
  const [trM, setTrM] = useState();
  const [refresh, setRefresh] = useState(true);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState(0);
  const [filSet, setFilSet] = useState('');
  let editMenu, filter;

// Screen Main Lifetime Checks ########################################################################

  useEffect(() => {
    if(props.settings.getProc === true) {
      setLoad(true);
      props.settings.loadProc = false;
      checkStatus(0);
      props.settings.getProc = false;
    }; 
  });

  useEffect(() => {
    if(refresh) {
      showProcess();
      setRefresh(false);
      setFilSet(showFilter());     
    }; 
  });

  useEffect(() => {
    if( navigation === 0) {
      props.onSwitchNavi([0, true, ]);
    } else if (navigation === 1) {
      props.onSwitchNavi([1, true, ]);
    } else if (navigation === 3) {
      props.onSwitchNavi([3, true, trM ]);
    }
  });

// Screen Main help Functions #########################################################################

  const navHandler = (datas, x, val, ind) => {
    setNavigation(x);
    if (datas !== false) setTrM(datas);
    if (val === true) setRefresh(true);
    if (x === 2.3) setIndex(ind);
    if (props.vorg.length > 0) if (x === 2 && props.vorg[index].refresh === true) sendChange();
  };
  
  const showFilter = () => {

    let str = '';

    if (props.user.filter.eroef === true) str += '0 '; 
    if (props.user.filter.inBear === true) str += '1 ';  
    if (props.user.filter.erled === true) str += '2 ';  
    if (props.user.filter.angeb === true) str += '3 ';  
    if (props.user.filter.versch === true) str += '4 '; 
    if (props.user.filter.gewonn === true) str += '5 ';  
    if (props.user.filter.verlor === true) str += '9';  

    return str;
  };   
  

  const checkStatus = i => {
    if (props.settings.loadProc === false && i < 100 ) {
      i++;
      console.log(i);
      setTimeout(() => { checkStatus(i)}, 200);
    } else if (props.settings.loadProc === true) {
      setRefresh(true); 
      console.log('fertig');
    } else if (i >= 100) {
      console.log('Vorgänge: Zeitüberschreitung');
    };      
  };

  const addProcesses = () => {
    setTrM(Vorgang.newBlankoProcess(props.user, props.knd.kundeNr));
    setNavigation(2.4);
  }; 

  const createNew = () => {
    if (trM.vTyp === '') Alert.alert('Auswählen', 'Vorgangstyp wählen', [{text: 'Okay', style: 'destructive'}]);
    else {
      Vorgang.setProcess(props.user, props.settings, props.vorg, true, trM, 0);
      setNavigation(2);
      setLoad(true);
      props.settings.loadProc = false;
      checkStatus(0);
    };    
  };

  const sendChange = () => {    
    Vorgang.setProcess(props.user, props.settings, props.vorg, index, trM, 0);
    props.vorg[index].refresh = false;       
    setNavigation(2);
    setLoad(true);
    props.settings.loadProc = false;
    checkStatus(0);
  };
  
// Screen Main Cont Functions ##########################################################################

  const showProcess = () => {   
    
    list.length = 0;

    for (let i = 0; i < props.vorg.length; i++) {
      if (
        (props.vorg[i].status === 0 && props.user.filter.eroef === true) ||
        (props.vorg[i].status === 1 && props.user.filter.inBear === true) ||
        (props.vorg[i].status === 2 && props.user.filter.erled === true) ||
        (props.vorg[i].status === 3 && props.user.filter.angeb === true) ||
        (props.vorg[i].status === 4 && props.user.filter.versch === true) ||
        (props.vorg[i].status === 5 && props.user.filter.gewonn === true) ||
        (props.vorg[i].status === 9 && props.user.filter.verlor === true)
      ) { 
        console.log('Filter angesprungen bei Vorgang mit ID: ' + props.vorg[i].vorgID);
        continue;
      };  
      setList(customers =>[...customers, BasicStuff.newLiSeg(
        props.vorg[i].vorgID, 
        (<PrestentTile 
          pTol      = {'ID - ' + props.vorg[i].vorgID} 
          pTul      = {props.vorg[i].status + ' - ' + props.vorg[i].statKl } 
          pTor      = {props.vorg[i].bez} 
          pTur      = {props.vorg[i].mANr + ' - ' + props.vorg[i].mAKlar}        
          pTButton  = {<Button title='...' onPress={navHandler.bind(this, props.vorg[i], 2.3, false, i)} />}
          pTMain    = {navHandler.bind(this, props.vorg[i], 3)}
        /> )
      )]);
    }    
  }; 

// Screen Main Navigation Check #######################################################################
  
  if (navigation === 2) {
    editMenu = <View></View>;
  } else if (navigation === 2.1) {
    editMenu = <View></View>;
  } else if (navigation === 2.2) {
    editMenu = <View></View>;
  } else if (navigation === 2.3) {
    editMenu = (<EditMenu 
      eMStyle   = {1}
      eMDatas   = {trM}
      eMNew     = {false}
    />);
  } else if (navigation === 2.4) {
    editMenu = (<EditMenu 
      eMStyle   = {1}
      eMDatas   = {trM}
      eMNew     = {true}
      eMCreate  = {createNew}
      eMClose   = {navHandler}
    />);
    };
// Return ############################################################################################## 

  return (
    <View style={styles.screen}>
      <View style={styles.headerBox}>
        <View style={styles.textBox}>
          <Text>ID: {props.knd.kundeNr} | {props.knd.name1}</Text>
          <Text>{props.knd.ort} </Text>
          <Text>Filter aktiv: {filSet}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.addButton} title='+' onPress={addProcesses} />
        </View>
      </View>
      <Card style={styles.balken}></Card>
      <TouchableOpacity activeOpacity={1} onPress={navHandler.bind(this, false, 2, true)} style={styles.mainCont}>    
        <ScrollView> 
          {list.map((cust) => <Card style={styles.card} key={cust.id}>{cust.cont}</Card>)}
        </ScrollView> 
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={navHandler.bind(this, false, 2, true)} style={styles.balken}></TouchableOpacity>
      {editMenu}  
    </View>
  );
};

// Styling Elements ##################################################################################     

const styles = StyleSheet.create({
  screen:{
    flex:1,
    alignItems: 'center'
  },  
  mainCont:{
    flex: 1,
    width: 500,
    maxWidth: '100%',
    alignItems: 'center',
  },
  textBox: {
    width: '80%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {        
    width: 500,
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balken:{
    width: 500,
    height: 25,
    backgroundColor: 'grey',
  },
  headerBox:{
    flexDirection: 'row',
    width: 500,
    maxWidth: '95%',
    padding: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    width: 40,
    height: 50,
    margin: 20,
    justifyContent: 'center',
  },
});

export default ProcessesScreen;