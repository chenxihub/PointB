import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button
} from 'react-native';

import {StackNavigator} from 'react-navigation';

import Girl from './Girl';


class HomeScreen extends Component {
    state = {
        word: ''
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.homeScreen}>
                <Text>i am boy</Text>
                <Button
                    style={styles.text}
                    onPress={() => navigate('Girl', {
                        word: '一支玫瑰',
                        callback: (word) => {
                            this.setState({
                                word: word
                            })
                        }
                    })}
                    title="送女孩一枝花"
                />
                <Text style={styles.text}>收到女孩的礼物：{this.state.word}</Text>
            </View>
        )
    }
}

const DetailsScreen = () => (
    <View style={styles.homeScreen}>
        <Text>Details Screen</Text>
    </View>
);


const RootNavigator = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            headerTitle: 'Boy',
        },
    },
    Girl: {
        screen: Girl,
        navigationOptions: {
            headerTitle: 'Girl',
        },
    },
});


export default class Boy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: ''
        }
    }

    render() {
        return (
            <RootNavigator/>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
    },
    homeScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});