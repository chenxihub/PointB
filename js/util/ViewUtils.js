import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import {MORE_MENU} from "../common/MoreMenu";
import GlobalStyles from '../../res/styles/GlobalStyles'
import {FLAG_LANGUAGE} from "../expand/LanguageDao";

export default class ViewUtils {
    /**
     *
     * @param callback tab点击的回调函数
     * @param icon  左侧图标
     * @param text  显示的文本
     * @param tintStyle 图标着色
     * @param expandableIcon  右侧图标
     */
    static getSettingItem(callback, icon, text, tintStyle, expandableIcon) {
        return (
            <TouchableOpacity
                onPress={callback}
            >
                <View style={styles.item}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={[{ width: 40, height: 40, marginRight: 10 }, { tintColor: '#03A9F4' }]}
                            source={icon}
                        />
                        <Text>{text}</Text>
                    </View>
                    <Image
                        style={[{ width: 24, height: 24, }, { tintColor: '#03A9F4' }]}
                        source={expandableIcon ? require('../../res/img/ic_tiaozhuan.png') : expandableIcon}
                    />
                </View>
                <View style={GlobalStyles.line}/>
            </TouchableOpacity>
        )
    }

    /**
     *
     * @param callback 跳转的页面的回调函数
     * @param leftIcon  左边的icon
     * @param tabText   tab 栏目的文字
     * @param rightIcon 右边的icon
     * @returns {*}
     */

    static getTabViewItem(callback, leftIcon, tabText, rightIcon) {
        return (
            <TouchableOpacity
                onPress={callback}
            >
                <View style={GlobalStyles.line}/>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    height: 60
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={[{ width: 22, height: 22, marginRight: 10 }, { tintColor: '#03A9F4' }]}
                            source={leftIcon}
                        />
                        <Text>{tabText}</Text>
                    </View>
                    <Image
                        style={[{ width: 24, height: 24, }, { tintColor: '#03A9F4' }]}
                        source={rightIcon ? rightIcon : require('../../res/img/ic_tiaozhuan.png')}
                    />
                </View>
                <View style={GlobalStyles.line}/>
            </TouchableOpacity>
        )
    }
}