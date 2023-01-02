import React from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native';

import Card from './Card';

// Menu Main Function ##########################################################################

const Menu = props => {

let startButton, custButton, logoutButton, endButton;

startButton = <View style={styles.button}><Button title='Haubtmenü' onPress={props.menuMain}/></View>;
custButton = <View style={styles.button}><Button title='Kundenmenü' onPress={props.menuProcess}/></View>;
endButton = <View style={styles.button}><Button title='Ende'/></View>;
logoutButton = <View style={styles.button}><Button title='Logout' onPress={props.menuLogout}/></View>;


// Menu Return ##################################################################################

  return(
    <Modal animationType='fade' transparent={true}>
      <TouchableOpacity style={styles.touch} onPress={props.menuClose}>
        <Card style={styles.card}>
          <Text style={styles.textTitle}>Menu</Text>
          <View style={styles.textBox}>
            <Text>{props.menuLog}</Text>
            <Text>{props.menuName}</Text>
            <Text>{props.menuNameId}</Text>
          </View>
          {startButton}
          {custButton}
          <View style={styles.space}></View>
          {logoutButton}
          {endButton}
        </Card>
      </TouchableOpacity>
    </Modal>
  )
};

//Menu Styles ####################################################################################

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  touch: {
    width: '100%',
    height: '100%'
  },
  card: {        
    width: 200,
    maxWidth: '100%',
    height: 900,
    maxHeight: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:53
  },
  void: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'   
  },
  space: {
    flex: 1
  },
  textBox: {
    width: '80%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 3,    
    marginVertical: 5
  },
  button: {
    width: '80%',
    marginVertical: 5
  },
  textTitle: {
    color: 'black',
    fontSize: 16
  },
});

export default Menu;