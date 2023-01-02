import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard} from 'react-native';

import Card from '../components/Card';
import Input from '../components/Input';
import Colors from '../constants/colors';

// Main Login Function ########################################################################################

const LoginScreen = props => {

  const [enteredName, setEnteredName] = useState(props.settings.userName);
  const [enteredPass, setEnteredPass] = useState(props.settings.userPass);

  // Helping Functions ########################################################################################
  
  const nameInputHandler = inputText => setEnteredName(inputText);
  const passInputHandler = inputText => setEnteredPass(inputText);  

  const resetInputHandler = () => {
    setEnteredName('');
    setEnteredPass('');
  };

  const confirmInputHandler = () => {
    props.user.getSesID(enteredName, enteredPass, props.onLogin, props.settings, 0);
    Keyboard.dismiss();
  };  

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
      <View style={styles.screen}>
        <Card style={styles.inputContainer}>
          <Text style={styles.title}>Bitte Einloggen!</Text>
        </Card>            
        <Card style={styles.inputContainer}>
          <Input style={styles.input} 
            blurOnSubmit 
            autoCorrect={false}
            maxLength={50}
            onChangeText={nameInputHandler}
            value={enteredName}
          />
          <Input style={styles.input} 
            blurOnSubmit 
            autoCorrect={false}
            maxLength={50}
            onChangeText={passInputHandler}
            value={enteredPass}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title='Reset' onPress={resetInputHandler} color={Colors.accent} />
            </View>
            <View style={styles.button}>
              <Button title='Confirm' onPress={confirmInputHandler} color={Colors.primary} />
            </View>
          </View>
        </Card>         
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    marginVertical: 10
  },
  inputContainer: {
    width: 500,
    maxWidth: '90%',
    alignItems: 'center',
    marginVertical: 10              
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  button: {
    width: 90        
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

export default LoginScreen;