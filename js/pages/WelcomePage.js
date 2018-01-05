import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button
} from 'react-native';

import {StackNavigator, TabNavigator} from 'react-navigation';


export default class WelcomePage extends Component {
    static navigationOptions = {
        title: 'Welcome'
    };

    componentDidMount() {
        setTimeout(() => {

        },3000)
    }

    render() {
        return (
            <View>
                <Text>欢迎</Text>
            </View>
        )
    }
}