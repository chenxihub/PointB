import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button
} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import Boy from './Boy';
import PopularPage from './js/pages/PopularPage';
import AsyncStorageTest from './js/common/AsyncStorageTest';
import MyPage from './js/pages/my/MyPage';
import WebViewTest from './WebViewTest'
import FavoritePage from './js/pages/favorite/FavoritePage'
import FavoriteHome from './js/pages/favorite/FavoriteHome'
import TrendingPage from './js/pages/Trending/TrendingPage'

const RootTabs = TabNavigator({
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

export default RootTabs;

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