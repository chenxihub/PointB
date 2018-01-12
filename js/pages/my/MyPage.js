import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import KeyPage from './KeyPage';
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/LanguageDao";
import ArrayUtils from "../../util/ArrayUtils";
import SortKeyPage from '../../pages/SortKeyPage'

class MyPageHome extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.state = {
            text: '',
            dataArray: []
        };
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    }

    static navigationOptions = {
        title: '我的',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text
                    style={styles.tips}
                    onPress={() => navigate('KeyPage', {
                        text: 'params',
                        callback: (text) => {
                            this.setState({})
                        }
                    })}
                >自定义标签页</Text>
                <Text
                    style={styles.tips}
                    onPress={() => navigate('SortKeyPage', {
                        text: 'params',
                        callback: (text) => {
                            this.setState({})
                        }
                    })}
                >标签排序</Text>
                <Text
                    style={styles.tips}
                    onPress={() => navigate('KeyPage', {
                        text: 'params',
                        isRemoveKey: true,
                        callback: (text) => {
                            this.setState({})
                        }
                    })}
                >标签移除</Text>
            </View>
        )
    }
}


const StartNavigator = StackNavigator({
    Home: {
        screen: MyPageHome,
    },
    KeyPage: {
        screen: KeyPage
    },
    SortKeyPage: {
        screen: SortKeyPage
    }
});


export default class MyPage extends Component {
    render() {
        return (
            <StartNavigator/>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 40,
    },
    TextInput: {
        height: 44
    },
    redText: {
        height: 600
    }
});