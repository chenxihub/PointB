import React, {Component} from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    View
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import DataRepository from '../util/DataRepository';

const URL = 'https://api.github.com/search/repositories?q=';
const URL2 = 'https://api.douban.com/v2/movie/';
const QUERY_STR = '&sort=start';
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
        };
        this.dataRepository = new DataRepository;
    }

    onLoad() {
        let url = this.getUrl(this.text);
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
        // fetch(url)
        //     .then(response => response.json())
        //     .then(result => {
        //             // console.log(JSON.stringify(result));
        //             this.setState({
        //                 result: JSON.stringify(result)
        //             });
        //             console.log(this.state.result);
        //         }
        //     )
        //     .catch(error => {
        //         this.setState({
        //             result: JSON.stringify(error)
        //         })
        //     });
    };

    getUrl(key) {
        alert(key);
        return URL + key + QUERY_STR;
        // return URL + key;
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.TextInput}
                    onChangeText={text => this.text = text}
                />
                <Text
                    style={styles.tips}
                    onPress={() => {
                        this.onLoad()
                    }}
                >获取数据</Text>
                <ScrollView>
                    <Text style={styles.redText}>
                        data:{this.state.result}
                    </Text>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        flex: 1,
        borderWidth: 1,
    },
    tips: {
        fontSize: 40,
    },
    TextInput: {
        borderWidth: 1,
        height: 44
    },
    redText: {
        height: 600
    }
});