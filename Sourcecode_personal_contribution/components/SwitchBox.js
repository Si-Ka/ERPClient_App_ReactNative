import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Modal,  TouchableOpacity, Button} from 'react-native';

import Card from './Card';
import SwitchField from './SwitchField';
import Input from '../components/Input';
import BasicStuff from '../data/basicStuff';

// Switch Box Main Function ##########################################################################

const SwitchBox = props => {

  const [input, setInput] = useState(props.sBdata1);
  const [secInput, setSecInput] = useState (props.sBdata2);
  const [valList, setValList] = useState([]);
  const [index, setIndex] = useState(props.sBdata1);
  const [refresh, setRefresh] = useState(true);
  const [init, setInit] = useState(false);
  const [switchList, setSwitchList] = useState([]);  

  let size, srcNr, srcKl, title;

// SB Vorlagen #########################################################################################

  const priorNr   = [1, 2, 3, 4];
  const priorKl   = ['hoch', 'mittel', 'niedrig', 'unbekannt'];
  const statusNr  = [0, 1, 2, 3, 4, 5, 9];
  const statusKl  = ['eröffnet', 'in Bearbeitung', 'erledigt', 'angeboten', 'verschoben', 'gewonnen', 'verloren'];
  const vTypNr    = [10, 20, 25, 26, 29, 30, 32, 34, 36, 38, 39, 40, 50, 60, 61, 62, 80];
  const vTypKl    = [
    'Lead nicht qualifiziert', 
    'Lead qualifiziert', 
    'Kein Interesse', 
    'Kein Bedarf', 
    'Akquise OS Umsteller', 
    'Akquise', 
    'Akquise INTEGRA Einführung', 
    'RFI - Request for Information',
    'Analyse / Workshop',
    'RFP - Request for Proposal',
    'Finale Verhandlung',
    'Betreuung',
    'Jahresgespräch',
    'Beschwerde',
    'Klärung Offene Posten',
    'Kündigung WV',
    'Messe / Event'
  ];
  const vArtNr    = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 20, 21, 22, 23, 24, 25, 26];
  const vArtKl = [
    'Anschreiben',
    'Angebot',
    'Telefonat',
    'Email',
    'Präsentation',
    'Besuch',
    'Installation vor Ort',
    'Auftrag',
    'Allgemein / Info',
    'Task / Todo',
    'Telefonat nicht erreicht',
    'Taifun Fax / Email',
    'Taifun Fax Retoure',
    'Taifun Brief1',
    'Taifun Brief2',
    'Taifun Brief3',
    'Taifun Lost Order',
    'Taifun Kein Bedarf / WF'
  ];  
 
// lifetime Checks ######################################################################################## 

  useEffect(() => {
    if(refresh) {
      createValList(index);
      setInit (true);
      setRefresh(false);
    } 
  });

  useEffect(() => {
    if(init) {
      createSwitchList();
      setInit(false);
    } 
  });

// helping Functions #######################################################################################

  const inpHandler = inputText => setInput(inputText);

  const changeVal = (data1, data2) => {  
    setIndex(data1);
    setRefresh(true);
    setInput(data1);
    setSecInput(data2);
  }

  const createSwitchList = () => {

    switchList.length = 0;

    for (let i = 0; i < size; i++) {
      setSwitchList(segment =>[...segment, new BasicStuff.newLiSeg(
        i, (<SwitchField text={srcNr[i] + ' - ' + srcKl[i]} sw={valList[i]} onChange={changeVal.bind(this, srcNr[i], srcKl[i])} />)
      )]);
    }  
  }

  const createValList = (ind) => {

    valList.length = 0;

    for (let i = 0; i < size; i++) {
      if (ind === srcNr[i]) setValList(segment =>[...segment, true]);
      else if (ind !== i) setValList(segment =>[...segment, false]);
    }; 
  };

// Container ###############################################################################################

  let x = <View></View>;
  let y = (      
    <Input style={styles.input} 
      blurOnSubmit 
      autoCorrect={false}
      maxLength={50}
      onChangeText={inpHandler}
      value={input}
    />     
  );
  if (props.style === 'prior' ) {
    size  = 4;
    srcNr = priorNr;
    srcKl = priorKl;
    title = 'Priorität';
  } else if (props.style === 'status' ) {
    size  = 7;
    srcNr = statusNr;
    srcKl = statusKl;
    title = 'Status';
  } else if (props.style === 'vTyp' ) {
    size  = 17;
    srcNr = vTypNr;
    srcKl = vTypKl;
    title = 'Vorgangstyp';
  } else if (props.style === 'vArt') {
    size = 18;
    srcNr = vArtNr;
    srcKl = vArtKl;
    title = 'Vorgangsart';
  } else if (props.style === 'desc') {
    size = 0;
    title = 'Beschreibung';
    x = y;
  } else if (props.style === 'title') {
    size  = 0;
    title = 'Titel';
    x = y;
  };

// Menu Return ########################################################################################################

  return(
    <Modal style={styles.modal} animationType='fade' transparent={true}>      
      <TouchableOpacity style={styles.space} onPress={props.setClose.bind(this, false, props.sBdata1, props.sBdata2, false)}></TouchableOpacity>
        <View style={styles.innerBox}>
          <TouchableOpacity style={styles.space} onPress={props.setClose.bind(this, false, props.sBdata1, props.sBdata2, false)}></TouchableOpacity>
          <Card style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {switchList.map((x) => <View key={x.id}>{x.cont}</View>)}
            {x}
            <View>
              <Button title={'Speichern'} onPress={props.setClose.bind(this, false, input, secInput, true )}/>
            </View>             
          </Card>
          <TouchableOpacity style={styles.space} onPress={props.setClose.bind(this, false, props.sBdata1, props.sBdata2, false)}></TouchableOpacity>
        </View>
      <TouchableOpacity style={styles.space} onPress={props.setClose.bind(this, false, props.sBdata1, props.sBdata2)}></TouchableOpacity>      
    </Modal>
  )
};

//Menu Styles #################################################################################### switchList.map((x) => <View key={x.id}>{x.cont}</View>)

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  space: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  card: {
    width: '80%',
    maxWidth: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBox: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
    maxHeight: '90%',
  },
  textTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balken: {
    width: '100%',
    maxWidth: '100%',
    height: 10,
    backgroundColor: 'grey',
  },  
  input: {
    width: '90%',
    maxWidth: '90%',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  title: {
    fontSize: 15,
    marginVertical: 5
  }
});

export default SwitchBox;