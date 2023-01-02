import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PresentTile = props => {
  return (
    <TouchableOpacity onPress = {props.pTMain} >
      <View style={styles.cuBuIn}>
        <View>
          <Text>{props.pTol}</Text>
          <Text>{props.pTul}</Text>
        </View>
        <View>
          <Text>{props.pTor}</Text>
          <Text>{props.pTur}</Text>
        </View>
        {props.pTButton}
      </View>
    </TouchableOpacity> 
  )
};

// Styling Elements ##################################################################################     

const styles = StyleSheet.create({
  cuBuIn: {
    width: 500,
    maxWidth: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
  },
});

export default PresentTile;