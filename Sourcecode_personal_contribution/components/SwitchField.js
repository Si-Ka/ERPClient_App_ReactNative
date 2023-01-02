import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SwitchField = props => {

  return (
    <View style={styles.switchBox}>
      <Text>{props.text}</Text>
      <View style={styles.space}></View>
      <Switch value={props.sw} onValueChange={props.onChange}/>
    </View>
  )
};

const styles = StyleSheet.create({
  switchBox:{
    flexDirection: 'row',    
    width: '90%',
    maxWidth: '95%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  space: {
    flex: 1,
  },  
});

export default SwitchField;