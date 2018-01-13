import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    WebView,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Girl from "./Girl";

const URL = 'https://www.baidu.com';

class WebViewTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: URL,
            canGoBack: false,
            title: 'WebView使用'
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state: { params }, goBack } = navigation;
        return {
            title: 'WebViewTest',
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
        };
    };

    search() {
        this.setState({
            url: this.searchText
        })
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
            title: e.title
        });
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            DeviceEventEmitter.emit('showToast', '到顶了');
        }
    }

    render() {
        return (
            <View style={styles.homeScreen}>
                <View style={styles.row}>
                    <Text style={styles.button}
                          onPress={() => {
                              this.goBack()
                          }}>
                        返回</Text>
                    <TextInput
                        onChangeText={text => this.searchText = text}
                        defaultValue={URL}
                        style={styles.input}
                    />
                    <Text style={styles.button}
                          onPress={() => {
                              this.search()
                          }}>
                        Go</Text>
                </View>
                <View style={styles.webview}>
                    <WebView
                        ref={webView => this.webView = webView}
                        onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                        source={{ uri: this.state.url }}
                    />
                </View>
            </View>
        )
    }
}

const RootNavigator = StackNavigator({
    Home: {
        screen: WebViewTest,
    },
    Girl: {
        screen: Girl,
    },
});


export default RootNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
    },
    homeScreen: {
        flex: 1,
    },
    webview: {
        flex: 1,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    input: {
        height: 44,
        flex: 1,
        borderWidth: 1,
        borderColor: '#f8f8f8',
        borderRadius: 4,
        marginLeft: 10,
        marginRight: 10
    }
});