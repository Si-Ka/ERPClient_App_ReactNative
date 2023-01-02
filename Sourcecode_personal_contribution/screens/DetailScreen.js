import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';

import Card from '../components/Card';
import PrestentTile from '../components/PresentTile';
import EditMenu from '../components/EditMenu';
import Details from '../data/details';
import BasicStuff from '../data/basicStuff';

// Screen Main #############################################################################################

const DetailScreen = props => { 

  const [navigation, setNavigation] = useState(3);
  const [list, setList] = useState([]);  
  const [trM, setTrM] = useState();
  const [refresh, setRefresh] = useState(true);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState(0);
  let editMenu, vorEdit /*, update*/;

// Screen Main Lifetime Checks #############################################################################

useEffect(() => {
  if(props.settings.getDet === true) {
    setLoad(true);
    props.settings.loadDet = false;
    checkStatus(0);
    props.settings.getDet = false;
  }; 
});

  useEffect(() => {
    if(refresh) {
      showDetail();
      setRefresh(false);
    } 
  });

  useEffect(() => {
    if( navigation === 0) {
      props.onSwitchNavi([0, true, ]);
    } else if (navigation === 1) {
      props.onSwitchNavi([1, true, ]);
    } else if (navigation === 2) {
      props.onSwitchNavi([2, true, ]);
    }
  });

// Screen Main help Functions ###############################################################################

  const navHandler = (datas, x, val, ind) => {
    setNavigation(x);
    if (datas !== false) setTrM(datas);
    if (val === true) setRefresh(true);
    if (x === 3.3) setIndex(ind);
    if (props.detList.length > 0) if (x === 3 && props.detList[index].refresh === true) sendChange();      
  };

  const checkStatus = i => {
    if (props.settings.loadDet === false && i < 100 ) {
      i++;
      console.log('Details:', i);
      setTimeout(() => { checkStatus(i)}, 200);
    } else if (props.settings.loadDet === true) {
      setRefresh(true); 
      console.log('fertig');
    } else if (i >= 100) {
      console.log('Details: Zeitüberschreitung');
    };      
  };

  const addDetail = () => {
    //setTrM(detailHandler(5, props.user, 4));
    setNavigation(3.4);
  };  

  const sendChange = () => {
    //detailHandler(2, props.user, 4, 0, props.detList[index]);
    props.detList[index].refresh = false;
  };

  const createNewDetail = () =>{
    //props.detList.push(detailHandler(3, props.user, 4, 0, trM ));
    setNavigation(3);
    setRefresh(true);
  };

// Screen Main Add Details ##########################################################################

const showDetail = () => {   
  
  list.length = 0;

  for (let i = 0; i < props.detList.length; i++) {
    console.log(i);
    let x = i;
    setList(customers =>[...customers, BasicStuff.newLiSeg(
      props.detList[i].lfdNr, 
      (<PrestentTile 
        pTol      = {props.detList[i].vorgID + ' | ' + props.detList[i].lfdNr } 
        pTul      = {props.detList[i].vArt + ' - ' + props.detList[i].vArtKl} 
        pTor      = {props.detList[i].mAKlar} 
        pTur      = {props.detList[i].status + ' - ' +props.detList[i].statKl}        
        pTButton  = {<View></View>}
        pTMain    = {navHandler.bind(this, props.detList[i], 3.3, false, i)}
      /> )
    )]);
  }    
}; 

// Screen Main Container #######################################################################
  
  const vorEditDefault = (
    <TouchableOpacity style={styles.rowBox} onPress={navHandler.bind(this, false, 3.2)}>
        <View style={styles.textBox2}>        
          <Text>Vorgang: ID-{'n'} | {'n'}</Text>
          <Text>Status: {'n'}</Text>
        </View> 
      </TouchableOpacity> 
  );

  if (navigation === 3) {
    editMenu = <View></View>;
    vorEdit = vorEditDefault;
  } else if (navigation === 3.2) {
    editMenu = <View></View>;
    vorEdit  = (<EditMenu 
      eMStyle   = {1}
      eMDatas   = {props.vor}
    />);
  } else if (navigation === 3.3) {
    editMenu = (<EditMenu 
      eMStyle   = {2}
      eMDatas   = {trM}
      eMNew     = {false}
    />);
    vorEdit = vorEditDefault; 
  } else if (navigation === 3.4) {
    editMenu = (<EditMenu 
      eMStyle   = {2}
      eMDatas   = {trM}
      eMNew     = {true}
      eMCreate  = {createNewDetail}
      eMClose   = {navHandler}
    />);
    vorEdit = vorEditDefault;
  }

// Return ############################################################################################## 

  return (    
    <View style={styles.screen} >      
        <Card style={styles.rowBox2}>   
          <Text>{props.knd}</Text>
          <View style={styles.space}></View>
          <Button title={'+'} onPress={addDetail} />  
        </Card>
        {vorEdit}
        <TouchableOpacity style={styles.balken}></TouchableOpacity>
        <TouchableOpacity  activeOpacity={1} style={styles.mainCont} onPress={navHandler.bind(this, false, 3, true)}>    
          <ScrollView> 
            {list.map((obj) => <Card style={styles.card} key={obj.id}>{obj.cont}</Card>)}
          </ScrollView> 
        </TouchableOpacity>
        <TouchableOpacity  activeOpacity={1} style={styles.balken} onPress={navHandler.bind(this, false, 3, true)}></TouchableOpacity>    
      {editMenu}
    </View>
  );
};

// Styling Elements ################################################################################## 

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    alignItems: 'center',
  },
  space: {
    flex: 1,
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
  rowBox:{
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
    padding: 5,
    alignItems: 'center',
  },
  rowBox2:{
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
    padding: 5,
    alignItems: 'center',
    margin: 5
  },  
  balken:{
    width: 500,
    height: 25,
    backgroundColor: 'grey',
  },
  textBox2: {
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailScreen;