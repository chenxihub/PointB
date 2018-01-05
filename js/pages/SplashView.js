import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import {StackNavigator} from 'react-navigation';
import GetSetStorg from '../util/GetSetStorg';
import GuideView from '../pages/GuideView';
import App from '../../App';

const splashImg = require('../../res/images/StartPage.png');

const { width, height } = Dimensions.get('window');

//create a component


class StarPage extends Component {
    componentDidMount() {
        // Animated.timing(
        //     this.state.bounceValue, { toValue: 1.2, duration: 1000 }
        // ).start();
        this.timer = setTimeout(() => {
            GetSetStorg.getStorgeAsync('isFirst')
                .then((result) => {
                    if (result == null || result === '') {
                        //to first start
                        this.props.navigation.navigate('GuideView');
                        GetSetStorg.setStorgeAsync('isFirst', 'true');
                        console.log('11111');
                    }
                    //to second start
                    else {
                        this.props.navigation.navigate('App');
                        console.log();
                    }
                })
                .catch((error) => {
                    console.log('===============');
                    console.log('系统异常：' + error);
                    console.log('===============');
                })
        }, 1000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Animated.Image
                style={{
                    width: width,
                    height: height,
                    // transform: [{ scale: this.state.bounceValue }]
                }}
                source={splashImg}
            />
        )
    }
}

const StartNavigator = StackNavigator({
    StarPage: {
        screen: StarPage,
        navigationOptions: {}
    },
    GuideView: {
        screen: GuideView,
        navigationOptions: {}

    },
    App: {
        screen: App,
        navigationOptions: {}

    },
}, {
    header: {
        visible: false,
    },

});

export default class SplashView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // bounceValue: new Animated.Value(1)
        };
    }

    render() {
        return (
            <StartNavigator/>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});
