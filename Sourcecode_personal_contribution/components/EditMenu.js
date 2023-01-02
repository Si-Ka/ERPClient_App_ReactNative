import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

import SwitchBox from './SwitchBox';

// Edit Menu Main Funtion ###################################################################################

const EditMenu = props => {

  const [swBoxStyle, setSwBoxStyle] = useState(false);
  const [trC1, setTrC1] = useState();
  const [trC2, setTrC2] = useState();

  const swBoxHandler = (wahl, data1, data2, save) => {
    setSwBoxStyle(wahl);
    setTrC1(data1);
    setTrC2(data2);
    if (swBoxStyle === 'prior') {
      props.eMDatas.prior   = data1;
      props.eMDatas.priKl   = data2;
    } else if (swBoxStyle === 'status') {
      props.eMDatas.status  = data1;
      props.eMDatas.statKl  = data2;
    } else if (swBoxStyle === 'vTyp') {
      props.eMDatas.vTyp    = data1;
      props.eMDatas.vTypKl  = data2;
    } else if (swBoxStyle === 'vArt') {
      props.eMDatas.vArt    = data1;
      props.eMDatas.vArtKl  = data2;
    } else if (swBoxStyle === 'desc') {
      props.eMDatas.bem = data1;
    } else if (swBoxStyle === 'title') {
      props.eMDatas.bez = data1;
    };
    if (save === true) props.eMDatas.refresh = true;
  };

  let menu      = <View></View>;
  let swBox     = <View></View>;
  let buttonBox = <View></View>;

// Container Choise ##########################################################################################

  if (props.eMNew === true) {
    buttonBox = (
      <View style={styles.buttonBox}>
        <Button title={'Abbrechen'} onPress={props.eMClose.bind(this, false, 3, true)} />
        <View style={styles.space} ></View>
        <Button title={'Erstellen'} onPress={props.eMCreate} />
      </View>
    );
  };



  if (props.eMStyle === 1) {
    menu = (
      <View style={styles.editMenu1}> 
        <Text>Vorgangs ID: {props.eMDatas.vorgID} | {props.eMDatas.creat}</Text>       
        <TouchableOpacity style={styles.change1} onPress={swBoxHandler.bind(this, 'vTyp', props.eMDatas.vTyp, props.eMDatas.vTypKl)}><Text>{props.eMDatas.vTyp} - {props.eMDatas.vTypKl}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.change1} onPress={swBoxHandler.bind(this, 'title', props.eMDatas.bez)}><Text>{props.eMDatas.bez}</Text></TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity style={styles.change2} onPress={swBoxHandler.bind(this, 'status', props.eMDatas.status, props.eMDatas.statKl)}><Text>{props.eMDatas.status} - {props.eMDatas.statKl}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.change2} onPress={swBoxHandler.bind(this, 'prior', props.eMDatas.prior, props.eMDatas.priKl)}><Text>{props.eMDatas.prior} - {props.eMDatas.priKl}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.comment} onPress={swBoxHandler.bind(this, 'desc', props.eMDatas.bem)}><Text>{props.eMDatas.bem}</Text></TouchableOpacity>
        {buttonBox}
      </View> 
    );
  } else if (props.eMStyle === 2) {
    menu = (
      <View style={styles.editMenu2}> 
        <Text>{props.eMDatas.datum} | {props.eMDatas.mANr} - {props.eMDatas.mAKlar}</Text>       
        <TouchableOpacity style={styles.change1} onPress={swBoxHandler.bind(this, 'vArt', props.eMDatas.vArt, props.eMDatas.vArtKl)}><Text>{props.eMDatas.vArt} - {props.eMDatas.vArtKl}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.change1} onPress={swBoxHandler.bind(this, 'status', props.eMDatas.status, props.eMDatas.statKl)}><Text>{props.eMDatas.status} - {props.eMDatas.statKl}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.comment} onPress={swBoxHandler.bind(this, 'desc', props.eMDatas.bem)}><Text>{props.eMDatas.bem}</Text></TouchableOpacity>
        {buttonBox}
      </View> 
    );
  }

  if (swBoxStyle === false) {
    swBox = <View></View>;
  } else  {
    swBox = <SwitchBox
      style     = {swBoxStyle}
      setClose  = {swBoxHandler}
      sBdata1   = {trC1}
      sBdata2   = {trC2}
    />
  };

// Edit Menu Return ###################################################################################

  return (
    <View>
      {menu}
      {swBox}
    </View>
  )
};

// Edit Menu Styles ###################################################################################

const styles = StyleSheet.create({
  editMenu1: {
    width: 500,
    maxWidth: '100%',
    alignItems: 'center',
  },
  editMenu2: {
    width: 500,
    maxWidth: '100%',
    alignItems: 'center',
  },
  change1:{
    width: '90%',
    backgroundColor: '#EEEEEE',
    borderBottomWidth: 0.5,
    height: 30,
    margin: 5,
    padding: 5
  },  
  change2:{
    width: '44%',
    backgroundColor: '#EEEEEE',
    borderBottomWidth: 0.5,
    height: 30,
    margin: 5,
    padding: 5
  },
  comment:{
    backgroundColor: '#EEEEEE',
    borderBottomWidth: 0.5,
    height: 90,
    width: '90%',
    margin: 5,
    padding: 5
  },
  row: {
    flexDirection: 'row',
  },
  buttonBox: {
    maxWidth: '70%',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5

  },
  space:{
    flex: 1,
  },
});

export default EditMenu;