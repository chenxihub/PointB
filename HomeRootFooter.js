import React, {Component} from 'react';
import {
    Text,
    Button,
    Image, StyleSheet
} from 'react-native';
import {StackNavigator, TabNavigator} from "react-navigation";
import PopularPage from './js/pages/PopularPage';
import MyPage from './js/pages/my/MyPage';
import FavoritePage from './js/pages/favorite/FavoritePage'
import TrendingPage from './js/pages/Trending/TrendingPage'
import RepositoryDetail from './js/pages/RepositoryDetail'
import SearchPage from './js/pages/SearchPage'
import AboutPage from './js/pages/my/About/AboutPage'
import AboutMePage from './js/pages/my/About/AboutMePage'
import SortKeyPage from './js/pages/my/SortKeyPage'
import KeyPage from './js/pages/my/KeyPage';
import WebViewPage from './js/pages/my/WebViewPage'

class RecentChatsScreen extends React.Component {
    static navigationOptions = {
        title: '111',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    componentDidMount() {
        // alert(JSON.stringify(this.props.navigation.state.params.data.item.full_name))
        // alert(JSON.stringify(this.props))
    }

    render() {
        return <Button
            onPress={() => this.props.navigation.navigate('Chat', { user: 'Lucy' })}
            title="Chat with Lucy"
        />
    }
}

class AllContactsScreen extends React.Component {
    static navigationOptions = {
        title: '222',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    render() {
        return <Text>List of all contacts</Text>
    }
}

class ChatScreen extends React.Component {
    render() {
        return <Text>List of all contacts</Text>
    }
}

const PopularScreen = TabNavigator({
    Popular: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '热度',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_polular.png') : require('./res/img/ic_polular.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
    Tredding: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_trending.png') : require('./res/img/ic_trending.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
    Favorite: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_favorite.png') : require('./res/img/ic_favorite.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
    My: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_my.png') : require('./res/img/ic_my.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
});

const MainScreenNavigator2 = TabNavigator({
    Recent: {
        screen: RecentChatsScreen,
        navigationOptions: {
            tabBarLabel: 'screen2',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_polular.png') : require('./res/img/ic_polular.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
    All: {
        screen: AllContactsScreen,
        navigationOptions: {
            tabBarLabel: 'screen3',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/img/ic_polular.png') : require('./res/img/ic_polular.png')}
                    style={[styles.image, { tintColor: tintColor }]}
                />
            ),
        },
    },
});
const HomeRootFooter = StackNavigator({
    //首页
    Home: {
        screen: PopularScreen
    },
    //趋势和热门详情页
    RepositoryDetail: {
        screen: RepositoryDetail,
    },
    //个人中心关于页面
    About: {
        screen: AboutPage,
    },
    //个人中心关于页面
    SortKeyPage: {
        screen: SortKeyPage,
    },
    //个人中心关于页面
    KeyPage: {
        screen: KeyPage,
    },
    //关于作者
    AboutMe: {
        screen: AboutMePage
    },
    //Website页面
    Website: {
        screen: WebViewPage
    },
    SearchPage: {
        screen: SearchPage
    },
    //测试页面  子页面中也有TAB栏目的时候
    Chat: {
        screen: MainScreenNavigator2,
    },
});

export default HomeRootFooter;

const styles = StyleSheet.create({
    flex: {
        flex: 1
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