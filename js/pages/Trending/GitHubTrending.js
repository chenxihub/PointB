/**
 * @AsyncStorage 的数据的存储，清楚，获取
 *
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AsyncStorage
} from 'react-native';
import {StackNavigator} from "react-navigation";
import Toast, {DURATION} from 'react-native-easy-toast';
import DataRepository, {FLAG_STORAGE} from '../../util/DataRepository'

const URL = 'https://github.com/trending/';

class GitHubTrending extends Component {
    static navigationOptions = {
        title: 'Trending',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    constructor(props) {
        super(props);
        this.dataRepostory = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            result: ''
        };
    }

    onLoad() {
        let url = URL + this.text;
        this.dataRepostory.fetchRepository(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                });
                this.toast.show('获取成功', DURATION.LENGTH_LONG)
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                });
                this.toast.show('获取失败', DURATION.LENGTH_LONG)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={{ height: 44, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 6, margin: 8 }}
                        onChangeText={text => this.text = text}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                        style={styles.tips}
                        onPress={() => this.onLoad()}
                    >保存</Text>
                    <Text>{this.state.result}</Text>
                </View>
                <Toast ref={toast => this.toast = toast} style={styles.toast}/>
            </View>
        )
    }
}


const StartNavigator = StackNavigator({
    Home: {
        screen: GitHubTrending,
    },
});


export default StartNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
    },
    toast: {
        position: 'absolute',
        bottom: 60,
    }
});