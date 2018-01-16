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

export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.navigation.state.params.url,
            canGoBack: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state: { params } } = navigation;
        return {
            headerTitle: params.title,
            headerBackTitle: '返回',
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
        };
    };

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
            title: e.title
        });
    }

    render() {
        return (
            <View style={styles.homeScreen}>
                <View style={styles.window}>
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
    window: {
        flex: 1,
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