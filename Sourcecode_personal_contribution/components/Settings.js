import React, {useState} from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native';

import Card from './Card';
import SwitchField from './SwitchField';

// Menu Main Function ##########################################################################

 

const Settings = props => {

  const [eroef, setEroef] = useState(props.filter.eroef);
  const [inBear, setInBear] = useState(props.filter.inBear);
  const [erled, setErled] = useState(props.filter.erled);
  const [angeb, setAngeb] = useState(props.filter.angeb);
  const [versch, setVersch] = useState(props.filter.versch);
  const [gewonn, setGewonn] = useState(props.filter.gewonn);
  const [verlor, setVerlor] = useState(props.filter.verlor);

// Helping Functions ############################################################################

  const setBack = () => {
    setEroef(props.filter.eroef);
    setInBear(props.filter.inBear);
    setErled(props.filter.erled);
    setAngeb(props.filter.angeb);
    setVersch(props.filter.versch);
    setGewonn(props.filter.gewonn);
    setVerlor(props.filter.verlor);
  };

// Menu Return ##################################################################################

  return(
    <Modal animationType='fade' transparent={true}>      
      <TouchableOpacity style={styles.top} onPress={props.setClose}></TouchableOpacity>
        <View style={styles.innerBox}>
          <TouchableOpacity style={styles.void} onPress={props.setClose}></TouchableOpacity>
          <Card style={styles.card}>
            <Text style={styles.textTitle}>Einstellungen</Text>
            <View style={styles.balken}></View>
            <Text>Filtereinstellungen</Text>
            <SwitchField text={'0 - eröffnet'} sw={eroef} onChange={newValue => setEroef(newValue)} />
            <SwitchField text={'1 - in Bearbeitung'} sw={inBear} onChange={newValue => setInBear(newValue)} />
            <SwitchField text={'2 - erledigt'} sw={erled} onChange={newValue => setErled(newValue)} />
            <SwitchField text={'3 - angeboten'} sw={angeb} onChange={newValue => setAngeb(newValue)} />
            <SwitchField text={'4 - verschoben'} sw={versch} onChange={newValue => setVersch(newValue)} />
            <SwitchField text={'5 - gewonnen'} sw={gewonn} onChange={newValue => setGewonn(newValue)} />
            <SwitchField text={'9 - verloren'} sw={verlor} onChange={newValue => setVerlor(newValue)} />
            <View style={styles.buttonBox}>
              <Button title='Zurück' onPress={setBack} />                
              <View style={styles.space}></View>
              <Button title='Save' onPress={props.saveDatas.bind(this, eroef, inBear, erled, angeb, versch, gewonn, verlor )} />                
            </View>
            <View style={styles.balken}></View>              
            <View style={styles.space}></View>
            <View style={styles.textBox}>
              <Text>{props.menuLog}</Text>
              <Text>{props.menuName}</Text>
              <Text>{props.menuNameId}</Text>
            </View>
            <View style={styles.button}>
              <Button title='Logout' onPress={props.menuLogout}/>
            </View>
          </Card>
        </View>
      <TouchableOpacity style={styles.void} onPress={props.setClose}></TouchableOpacity>      
    </Modal>
  )
};

//Menu Styles ####################################################################################

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  top: {
    height: 53,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  space: {
    flex: 1
  },
  void: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'   
  },
  buttonBox: {    
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5
  },
  card: {
    width: 200,
    maxWidth: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerBox: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
  },
  textTitle: {
    color: 'black',
    fontSize: 16
  },
  balken: {
    width: '100%',
    maxWidth: '100%',
    height: 10,
    backgroundColor: 'grey',
    marginVertical: 5
  },
  textBox: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 3,    
    marginVertical: 5
  },
  button: {
    width: '80%',
    marginVertical: 5
  }
});

export default Settings;