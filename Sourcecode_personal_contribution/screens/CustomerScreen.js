import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Keyboard, TouchableOpacity } from 'react-native';

import Card from '../components/Card';
import Input from '../components/Input';
import PrestentTile from '../components/PresentTile';
import BasicStuff from '../data/basicStuff';

// Screen Main Function ###############################################################################

const CustomerScreen = props => { 

  const [navigation, setNavigation] = useState(1);
  const [list, setList] = useState([]);
  const [searchInput, setSeatchInput] = useState('Orga');
  const [refresh, setRefresh] = useState(true);
  const [load, setLoad] = useState(false);
  const [trM, setTrM] = useState();
  let x = false;
 
// Screen Main Lifetime Checks ########################################################################

useEffect(() => {
  if(refresh) {
    showCustomers();
    setRefresh(false);
    setLoad(false);
  } 
});

  useEffect(() => {if( navigation === 2) props.onSwitchNavi([2, true, trM])});    

// Screen Main help Functions #########################################################################

  const searchHandler = inputText => setSeatchInput(inputText);
  const resetHandler = () => {
    setSeatchInput('');
    Keyboard.dismiss();
    setRefresh(true);
  };

  const navProcessesScreen = (wahl) => { 
    props.procList.length = 0;
    setNavigation(2);
    setTrM(wahl);
  };
// Screen Main Cont Functions ##########################################################################

  const customersHandler = () => { 
    props.custList.length   = 0;
    props.settings.loadCust = false;
    props.onSearch(searchInput);
    Keyboard.dismiss();
    setLoad(true);
    checkStatus(0);
  }; 
  
  const checkStatus = i => {
    if (props.settings.loadCust === false && i < 75) {
      i++;
      setTimeout(() => { checkStatus(i)}, 200);
    } else if (props.settings.loadCust === true) {
      setRefresh(true);      
      Keyboard.dismiss();
    } else if (i >= 75) console.log('Customer: Zeitüberschreitung');
  };
      
  const showCustomers = () => {  
    
    list.length = 0;
    props.settings.loadCust = false;

    for (let i = 0; i < props.custList.length; i++) {
      setList(list =>[...list, BasicStuff.newLiSeg(
        props.custList[i].kundeNr , 
        (<PrestentTile 
          pTol      = {props.custList[i].kundeNr } 
          pTul      = {props.custList[i].lkz + ' - ' + props.custList[i].plz} 
          pTor      = {props.custList[i].name1} 
          pTur      = {props.custList[i].ort}        
          pTButton  = {<View></View>}
          pTMain    = {navProcessesScreen.bind(this, props.custList[i])}
        /> )
      )]);
    }    
  };     

// Return ############################################################################################## 

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.searchBox} activeOpacity={1} onPress={() => {Keyboard.dismiss()}}>
        <Text>Suche nach Kunden</Text>
        <Input style={styles.input} 
          blurOnSubmit 
          autoCorrect={false}
          maxLength={50}
          onChangeText={searchHandler}
          value={searchInput}
        />
        <View style={styles.buttonContainer}>
          <Button title='Reset' onPress={resetHandler}/>
          <Button title='Suchen' onPress={customersHandler}/>
        </View>
      </TouchableOpacity>
      <Card style={styles.balken}></Card>
      <TouchableOpacity style={styles.mainCont} activeOpacity={1} onPress={() => {Keyboard.dismiss()}}>    
        <ScrollView> 
          {list.map((cust) => <Card style={styles.card} key={cust.id}>{cust.cont}</Card>)}
        </ScrollView> 
      </TouchableOpacity>
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
  searchBox:{
    width: 500,
    maxWidth: '95%',
    padding: 5,
    alignItems: 'center',
    marginTop:5
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 300,
    maxWidth: '90%',
    justifyContent: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  input: {
    width: 200,
    maxWidth: '90%',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 2
  },
});

export default CustomerScreen;