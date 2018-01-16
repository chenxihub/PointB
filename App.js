/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    DeviceEventEmitter
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import RootTab from './RootTab';

import PopularPage from './js/pages/PopularPage'

export default class App extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.lisener = DeviceEventEmitter.addListener('showToast', (text) => {
            this.toast.show(text, DURATION.LENGTH_LONG)
        })
    }

    componentWillUnmount() {
        this.lisener && this.lisener.remove()
    }

    render() {
        return (
            <View style={styles.flex}>
                <RootTab/>
                {/*<PopularPage />*/}
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    page1: {
        backgroundColor: 'red',
    },
    page2: {
        backgroundColor: 'green'
    },
    image: {
        width: 22,
        height: 22,
    },
    homeScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
