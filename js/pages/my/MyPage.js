import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import KeyPage from './KeyPage';
import {FLAG_LANGUAGE} from "../../expand/LanguageDao";
import SortKeyPage from './SortKeyPage'
import {MORE_MENU} from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'

import AboutPage from './About/AboutPage'

export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.state = {
            text: '',
            dataArray: []
        };
    }

    static navigationOptions = {
        title: '我的',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    onClick(tips) {

    }

    //回调函数
    onGoPage(pageRoute, params) {
        const { navigate } = this.props.navigation;
        navigate(pageRoute, params);
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/*GitHub Popular*/}
                    <TouchableOpacity
                        onPress={() => navigate('About', {
                            isCustomerKey: true,
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_key,
                        })}
                    >
                        <View style={styles.item}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={[{ width: 40, height: 40, marginRight: 10 }, { tintColor: '#03A9F4' }]}
                                    source={require('../../../res/img/ic_trending.png')}
                                />
                                <Text>GitHub Popular</Text>
                            </View>
                            <Image
                                style={[{ width: 24, height: 24, }, { tintColor: '#03A9F4' }]}
                                source={require('../../../res/img/ic_tiaozhuan.png')}
                            />
                        </View>
                        <View style={GlobalStyles.line}/>
                    </TouchableOpacity>
                    {/*趋势管理*/}
                    <View style={styles.groupTitle}><Text style={styles.groupTitleText}>趋势管理</Text></View>
                    {/*自定义语言*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('KeyPage', {
                            isCustomerKey: true,
                            flag: FLAG_LANGUAGE.flag_language, ...this.props
                        })
                    }, require('./image/ic_custom_language.png'), '自定义语言', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*语言排序*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('SortKeyPage', { ...this.props, flag: FLAG_LANGUAGE.flag_language })
                    }, require('./image/ic_custom_language.png'), '语言排序', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*标签排序*/}
                    <View style={styles.groupTitle}><Text style={styles.groupTitleText}>标签管理</Text></View>
                    {/*自定义标签*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('KeyPage', { isCustomerKey: true, ...this.props, flag: FLAG_LANGUAGE.flag_key, })
                    }, require('./image/ic_custom_language.png'), '自定义标签', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*标签排序*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('SortKeyPage', { ...this.props, flag: FLAG_LANGUAGE.flag_key })
                    }, require('./image/ic_custom_language.png'), '标签排序', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*标签移除*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('KeyPage', {
                            isRemoveKey: true,
                            flag: FLAG_LANGUAGE.flag_language, ...this.props
                        })
                    }, require('./image/ic_custom_language.png'), '标签移除', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*设置*/}
                    <View style={styles.groupTitle}><Text style={styles.groupTitleText}>设置</Text></View>
                    {/*自定义主题*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('KeyPage', { isCustomerKey: true, ...this.props, flag: FLAG_LANGUAGE.flag_key, })
                    }, require('./image/ic_custom_language.png'), '自定义主题', require('../../../res/img/ic_tiaozhuan.png'))}
                    {/*关于作者*/}
                    {ViewUtils.getTabViewItem(() => {
                        this.onGoPage('AboutMe', {})
                    }, require('./image/ic_custom_language.png'), '关于作者', require('../../../res/img/ic_tiaozhuan.png'))}
                </ScrollView>
            </View>
        )
    }
}


// const StartNavigator = StackNavigator({
//     Home: {
//         screen: MyPageHome,
//     },
//     KeyPage: {
//         screen: KeyPage
//     },
//     SortKeyPage: {
//         screen: SortKeyPage
//     },
//     AboutPage: {
//         screen: AboutPage
//     }
// });


// export default StartNavigator;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tips: {
        fontSize: 40,
    },
    TextInput: {
        height: 44
    },
    redText: {
        height: 600
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