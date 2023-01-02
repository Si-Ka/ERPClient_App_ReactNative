import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import Card from '../components/Card';


const GameOverScreen = props => {
    
    const numberLog = [1,2,3,4,5];

    let contStats = (
        <View style={styles.card1}>
            <Text>{numberLog}</Text>
        </View>
    );

    return (
        <View style={styles.screen}>
            <Card style={styles.card1}>
                <Text style={styles.txtTitle}>The Game is Over!</Text>
                <View style={styles.cont01}>
                    <Text style={styles.txtNumberCont}>Rounds: </Text>
                    <Card>{props.roundsNumber}</Card>
                </View>
                <View style={styles.cont01}>
                    <Text style={styles.txtNumberCont}>User Number: </Text>
                    <Card>{props.userNumber}</Card>
                </View>
                <View style={styles.cont01}>
                    <Button title= 'New Game' onPress={props.onRestart}/>
                    <Button title= 'Show Stats' />
                </View>
            </Card>
            <Card style={styles.card1}>
                <Text style={styles.txtNumberCont}> Verlaufslog: </Text>
                {contStats}
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'        
    },
    card1: {        
        width: 300,
        maxWidth: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    txtTitle: {
        fontSize: 25
    },
    txtNumberCont: {
        fontSize: 20
    },
    cont01: {
        flexDirection: 'row',
        width: 300,
        maxWidth: '80%',
        justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },

});

export default GameOverScreen;