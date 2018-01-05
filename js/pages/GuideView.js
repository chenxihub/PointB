import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';
import App from '../../App';
import Girl from '../../Girl';

let image1 = require('../../res/images/guide/GuidePageOne.png');
let image2 = require('../../res/images/guide/GuidePageTwo.png');
let image3 = require('../../res/images/guide/GuidePageThree.png');

const { width, height } = Dimensions.get('window');

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <ScrollView>
                {/*<Image*/}
                {/*source={image1}*/}
                {/*style={styles.backgroundImage}*/}
                {/*/>*/}
                {/*<Image*/}
                {/*source={image2}*/}
                {/*style={[styles.backgroundImage]}*/}
                {/*/>*/}
                <Image
                    source={image3}
                    style={[styles.backgroundImage, styles.btnOut]}
                />
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => navigate('index')}
                >
                    <Text style={styles.btnText}>启动应用</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default class GuideView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RootNavigator/>
        )
    }
}
const RootNavigator = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {}

    },
    index: {
        screen: App,
        navigationOptions: {}

    },
}, {
    header: {
        visible: false,
    }
});

const styles = StyleSheet.create({
    contentContainer: {
        width: width * 3,
        height: height,
    },
    backgroundImage: {
        width: width,
        height: height,
    },
    btnOut: {
        alignItems: 'center',
    },
    btn: {
        width: 150,
        height: 50,
        backgroundColor: '#90ee90',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 550,
        position: 'absolute',
        bottom: 50,

    },
    btnText: {
        fontSize: 18,
        color: '#fff'
    },
});