import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    WebView,
    TextInput,
    DeviceEventEmitter,
    ScrollView,
    Image,
    TouchableOpacity, I18nManager
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import FavoriteDao from '../expand/FavoriteDao'

let Trending_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
    /**
     * <Button title="收藏"
     * onPress={navigation.state.params.handleSave ? navigation.state.params.handleSave : () => null/>
     * @param navigation
     * @returns {{title: *, headerTintColor: string, headerStyle: {backgroundColor: string}, headerRight: {}}}
     */

    static navigationOptions = ({ navigation }) => {
        let title = navigation.state.params.data.item.full_name ? navigation.state.params.data.item.full_name
            : navigation.state.params.data.item.fullName;
        let headerRight = (
            <TouchableOpacity
                onPress={navigation.state.params.handleSave ? navigation.state.params.handleSave : () => null}
            >
                <Image
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    source={navigation.state.params.data.isFavorite ? require('../../res/img/ic_star.png') : require('../../res/img/ic_star_navbar.png')}
                />
            </TouchableOpacity>
        );
        let headerLeft = (
            <View style={{  alignItems: 'center',flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.state.params.callback(true);
                        navigation.goBack();
                    }}
                >
                    <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: 'transparent', }}>
                        <Image
                            style={[styles.icon, { tintColor: 'white' }]}
                            source={require('../../res/assest/back-icon.png')}
                        />
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 17, paddingRight: 5, color: 'white' }}
                        >返回</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.state.params.callback(true);
                        navigation.goBack();
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{ fontSize: 17, paddingRight: 10, color: 'white' }}
                    >关闭</Text>
                </TouchableOpacity>
            </View>
        );
        return {
            title: title,
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
            headerRight: headerRight,
            headerLeft: headerLeft
        };
    };

    constructor(props) {
        super(props);
        this.url = this.props.navigation.state.params.data.item.html_url ? this.props.navigation.state.params.data.item.html_url
            : Trending_URL + this.props.navigation.state.params.data.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.navigation.state.params.flag);
        this.state = {
            url: this.url,
            canGoBack: false,
            isFavorite: this.props.navigation.state.params.data.isFavorite,
            favoriteIcon: this.props.navigation.state.params.data.isFavorite ? require('../../res/img/ic_star.png') : require('../../res/img/ic_unstar_transparent.png')
        }
    }


    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
        });
    }

    setFavoriteState(isFavorite) {
        this.props.navigation.setParams({
            isFavorite: isFavorite
        })
    }

    onRightButtonClick() {
        // alert(JSON.stringify(this.props.navigation.state.params.isFavoriteChanged));
        let projectModel = this.props.navigation.state.params.data;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteKeys(key)
        }
    }

    componentDidMount() {
        alert('flag 是：' + JSON.stringify(this.props.navigation.state.params.flag))
        // We can only set the function after the component has been initialized
        this.props.navigation.setParams({
            handleSave: () => {
                this.onRightButtonClick()
            }
        });
    }

    render() {
        return (
            <View style={styles.homeScreen}>
                {/*<ScrollView>*/}
                {/*<Text>{JSON.stringify(this.props.navigation.state.params.data)}</Text>*/}
                {/*</ScrollView>*/}
                {/*<Text>{this.props.navigation.state.params.data.html_url}</Text>*/}
                {/*<ScrollView>*/}
                {/*<Button*/}
                {/*title='callback'*/}
                {/*onPress={() => {*/}
                {/*this.props.navigation.state.params.callback(true);*/}
                {/*this.props.navigation.goBack();*/}
                {/*}}*/}
                {/*/>*/}
                {/*</ScrollView>*/}
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
    },
    icon: {
        height: 21,
        width: 13,
        marginLeft: 10,
        // marginRight: 22,
        marginVertical: 12,
        marginRight: 5,
        resizeMode: 'contain',
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
});