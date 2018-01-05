/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

export default class App extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'popular'
        }
    }

    render() {
        return (
            <View style={styles.flex}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'popular'}
                        selectedTitleStyle={{ color: 'red' }}
                        title="最热"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('./res/images/sale_purchase_icon_managemant.png')}/>}
                        renderSelectedIcon={() => <Image
                            style={[styles.image, { tintColor: 'red' }]}
                            source={require('./res/images/sale_purchase_icon_managemant.png')}/>}
                        badgeText="7"
                        onPress={() => this.setState({ selectedTab: 'popular' })}>
                        <View style={[styles.page1, styles.flex]}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tradding'}
                        selectedTitleStyle={{ color: 'red' }}
                        title="趋势"
                        renderIcon={() => <Image
                            style={styles.image}
                            source={require('./res/images/salepayment_icon_finacemanagement.png')}/>}
                        renderSelectedIcon={() => <Image
                            style={[styles.image, { tintColor: 'red' }]}
                            source={require('./res/images/salepayment_icon_finacemanagement.png')}/>}
                        renderBadge={() => <Text>o</Text>}
                        onPress={() => this.setState({ selectedTab: 'tradding' })}>
                        <View style={[styles.page2, styles.flex]}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'favorite'}
                        selectedTitleStyle={{ color: 'red' }}
                        title="收藏"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('./res/images/sale_purchase_icon_managemant.png')}/>}
                        renderSelectedIcon={() => <Image
                            style={[styles.image, { tintColor: 'red' }]}
                            source={require('./res/images/sale_purchase_icon_managemant.png')}/>}
                        badgeText="7"
                        onPress={() => this.setState({ selectedTab: 'favorite' })}>
                        <View style={[styles.page1, styles.flex]}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'my'}
                        selectedTitleStyle={{ color: 'red' }}
                        title="我的"
                        renderIcon={() => <Image
                            style={styles.image}
                            source={require('./res/images/salepayment_icon_finacemanagement.png')}/>}
                        renderSelectedIcon={() => <Image
                            style={[styles.image, { tintColor: 'red' }]}
                            source={require('./res/images/salepayment_icon_finacemanagement.png')}/>}
                        renderBadge={() => <Text>o</Text>}
                        onPress={() => this.setState({ selectedTab: 'my' })}>
                        <View style={[styles.page2, styles.flex]}></View>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}

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
    }
});
