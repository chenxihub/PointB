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
    Linking,
    Clipboard
} from 'react-native';

const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'https://github.com/joexchen',
            },
            CSDN: {
                title: 'CSDN',
                url: 'https://github.com/joexchen',
            },
            JIANSHU: {
                title: '简书',
                url: 'https://github.com/joexchen',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/joexchen',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '591678144',
            },
            Email: {
                title: 'Email',
                account: 'chenfuqiao0924@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: '移动开发者技术分享群',
                account: '591678144',
            },
            RN: {
                title: 'React Native学习交流群',
                account: '591678144',
            }
        },
    },

};
import ViewUtils from '../../../util/ViewUtils'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'
import Toast, {DURATION} from 'react-native-easy-toast'

export default class AboutPage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            showRepository: false,
            showBlog: false,
            showQQ: false,
            showContact: false
        };
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

    getRightIcon(isShow) {
        return isShow ? require('../../../../res/img/ic_tiaozhuan_up.png') : require('../../../../res/img/ic_tiaozhuan_down.png');
    }

    renderItems(obj, isShowAccount) {
        if (!obj) return null;
        let views = [];
        for (let i in obj) {
            let title = isShowAccount ? obj[i].title + ':' + obj[i].account : obj[i].title;
            views.push(
                <View key={i} title={title}>
                    {ViewUtils.getTabViewItem(() => {
                        this.onClick(obj[i])
                    }, {}, title, require('../../../../res/img/ic_tiaozhuan.png'))}
                </View>
            )
        }
        return views;
    }

    onClick(tab) {
        switch (tab) {
            case FLAG.CONTACT.items.Email:
                Linking.openURL('mailto:' + tab.account);
                break;
            case FLAG.CONTACT.items.QQ:
                this.toast.show('QQ:' + tab.account + '已复制到剪切板。');
                Clipboard.setString(tab.account);
                break;
            case FLAG.QQ.items.MD:
                this.toast.show('QQ:' + tab.account + '已复制到剪切板。');
                Clipboard.setString(tab.account);
                break;
            case FLAG.QQ.items.RN:
                this.toast.show('QQ:' + tab.account + '已复制到剪切板。');
                Clipboard.setString(tab.account);
                break;
            case FLAG.BLOG.items.CSDN:
            case FLAG.BLOG.items.GITHUB:
            case FLAG.BLOG.items.JIANSHU:
            case FLAG.BLOG.items.PERSONAL_BLOG:
                this.onGoPage('Website', {
                    ...this.props,
                    title: tab.title,
                    url: tab.url
                });
                break;
        }
    }

    render() {
        let content = (
            <View>
                {/*Blog*/}
                {ViewUtils.getTabViewItem(() => {
                    this.updateState({
                        showBlog: !this.state.showBlog,
                    })
                }, require('../image/ic_swap_vert.png'), FLAG.BLOG.name, this.getRightIcon(this.state.showBlog))}
                {this.state.showBlog ? this.renderItems(FLAG.BLOG.items, false) : null}
                {/*Contact*/}
                {ViewUtils.getTabViewItem(() => {
                    this.updateState({
                        showContact: !this.state.showContact,
                    })
                }, require('../image/ic_swap_vert.png'), FLAG.CONTACT.name, this.getRightIcon(this.state.showContact))}
                {this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null}
                {/*QQ*/}
                {ViewUtils.getTabViewItem(() => {
                    this.updateState({
                        showQQ: !this.state.showQQ,
                    })
                }, require('../image/ic_swap_vert.png'), FLAG.QQ.name, this.getRightIcon(this.state.showQQ))}
                {this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null}
                {/*Repository*/}
                {ViewUtils.getTabViewItem(() => {
                    this.onGoPage('Website', {
                        ...this.props,
                        title: 'JoexChen',
                        url: 'https://github.com/joexchen/PointB'
                    })
                }, require('../image/ic_swap_vert.png'), FLAG.REPOSITORY, require('../../../../res/img/ic_tiaozhuan.png'))}
            </View>
        );
        return (
            <View style={styles.container}>
                {this.aboutCommon.render(content, {
                    'name': 'GitHub Popular',
                    'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
                    'avatars': 'https://avatars1.githubusercontent.com/u/34295619?s=400&u=d067fbefb8a083156e0faf2f67c942e88578f922&v=4',
                    'backgroundImage': 'https://avatars1.githubusercontent.com/u/34295619?s=400&u=d067fbefb8a083156e0faf2f67c942e88578f922&v=4'
                })}
                <Toast ref={e => this.toast = e}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toast: {
        position: 'absolute',
        bottom: 100,
        borderWidth: 10,
        borderColor: 'red',
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

