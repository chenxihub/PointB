/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button, I18nManager,
    Platform,
    Linking
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {FLAG_LANGUAGE} from "../../../expand/LanguageDao";
import ViewUtils from '../../../util/ViewUtils'
import {MORE_MENU} from '../../../../js/common/MoreMenu'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'

export default class AboutPage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about)
    }

    updateState(dic) {
        this.setState(dic);
    }

    componentDidMount() {
        // alert(JSON.stringify(this.props.navigation.goBack()))
    }

    //回调函数
    onGoPage(pageRoute, params) {
        const { navigate } = this.props.navigation;
        navigate(pageRoute, params);
    }

    //deepLinking
    onDeepLink() {
        alert('callback成功');
        let url = 'mailto://crazycodeboy@gmail.com';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    render() {
        let content = (
            <View>
                {ViewUtils.getTabViewItem(() => {
                    this.onGoPage('Website', {
                        ...this.props,
                        title: 'JoexChen',
                        url: 'https://github.com/joexchen/PointB'
                    })
                }, require('../image/ic_swap_vert.png'), MORE_MENU.Website, require('../../../../res/img/ic_tiaozhuan.png'))}
                {ViewUtils.getTabViewItem(() => {
                    this.onGoPage('AboutMe', { ...this.props })
                }, require('../image/ic_swap_vert.png'), MORE_MENU.About_Author, require('../../../../res/img/ic_tiaozhuan.png'))}
                {ViewUtils.getTabViewItem(() => {
                    this.onDeepLink()
                }, require('../image/ic_swap_vert.png'), MORE_MENU.Feedback, require('../../../../res/img/ic_tiaozhuan.png'))}
            </View>
        );
        return (
            this.aboutCommon.render(content, {
                'name': 'GitHub Popular',
                'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
                'avatars': 'https://avatars1.githubusercontent.com/u/34295619?s=400&u=d067fbefb8a083156e0faf2f67c942e88578f922&v=4',
                'backgroundImage': 'https://avatars1.githubusercontent.com/u/34295619?s=400&u=d067fbefb8a083156e0faf2f67c942e88578f922&v=4'
            })
        )
    }
}


const styles = StyleSheet.create({
    icon: {
        height: 21,
        width: 13,
        marginLeft: 10,
        // marginRight: 22,
        marginVertical: 12,
        marginRight: 5,
        resizeMode: 'contain',
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60
    },
    groupTitle: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f8f8f8'
    },
    groupTitleText: {
        fontSize: 12,
        color: 'gray'
    }
});

