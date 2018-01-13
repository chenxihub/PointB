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

let Trending_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url = this.props.navigation.state.params.data.html_url ? this.props.navigation.state.params.data.html_url
            : Trending_URL + this.props.navigation.state.params.data.fullName;
        this.state = {
            url: this.url,
            canGoBack: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        let title = navigation.state.params.data.full_name ? navigation.state.params.data.full_name
            : navigation.state.params.data.fullName;
        return {
            title: title,
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
        });
    }

    render() {
        return (
            <View style={styles.homeScreen}>
                {/*<Text>{JSON.stringify(this.props.navigation.state.params.data)}</Text>*/}
                {/*<Text>{this.props.navigation.state.params.data.html_url}</Text>*/}
                <View style={styles.webview}>
                    <WebView
                        ref={webView => this.webView = webView}
                        onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                        source={{ uri: this.state.url }}
                        startInLoadingState={true}
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
    webview: {
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