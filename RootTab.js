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

const RootTabs = TabNavigator({
    Popular: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '热度',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/images/sale_purchase_icon_managemant.png') : require('./res/images/salepayment_icon_finacemanagement.png')}
                    style={[styles.image]}
                />
            ),
        },
    },
    Tredding: {
        screen: AsyncStorageTest,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/images/sale_purchase_icon_managemant.png') : require('./res/images/salepayment_icon_finacemanagement.png')}
                    style={[styles.image]}
                />
            ),
        },
    },
    Favorite: {
        screen: WebViewTest,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused ? require('./res/images/sale_purchase_icon_managemant.png') : require('./res/images/salepayment_icon_finacemanagement.png')}
                    style={[styles.image]}
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
                    source={focused ? require('./res/images/sale_purchase_icon_managemant.png') : require('./res/images/salepayment_icon_finacemanagement.png')}
                    style={[styles.image]}
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