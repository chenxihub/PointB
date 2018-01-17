import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    StatusBar,
    Text,
    Button,
    TouchableOpacity,
    Image
} from 'react-native';
import {NavigationActions} from 'react-navigation'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DataRepository, {FLAG_STORAGE} from '../util/DataRepository';
import Utils from '../util/Utils';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/LanguageDao';
import RepositoryDetail from './RepositoryDetail'

import ProjectModel from '../model/ProjectModel'

import FavoriteDao from '../expand/FavoriteDao';
import {DURATION} from "react-native-easy-toast";
import Toast from 'react-native-easy-toast'

export const ACTION_HOME = { A_SHOW_TOAST: 'showToast', A_RESTART: 'restart' };
export const FLAG_TAB = {
    flag_popularTab: 'tb_popular',
    flag_trendingTab: 'tb_trending',
    flag_favoriteTab: 'tb_favorite',
    flag_myTab: 'tb_my',
};

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=start';

export default class PopularPage extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let headerRight = (
            <TouchableOpacity
                onPress={params.handleSave ? params.handleSave : () => null}
            >
                <Image
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    source={require('../../res/img/ic_search_white_48pt.png')}
                />
            </TouchableOpacity>
        );
        return ({
            title: 'Popular',
            headerTintColor: '#FFFFFF',
            headerStyle: { backgroundColor: '#03A9F4' },
            headerRight: headerRight
        })
    };

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: [],
            isChange: false
        };
    }


    onRightButtonClick() {
        const { navigate } = this.props.navigation;
        navigate('SearchPage', {
            ...this.props,
            callback: (value) => {
                if (value) {
                    this.updataState({
                        isChange: true
                    });
                    this.load()
                } else {
                    return
                }
            }
        })
    }

    updataState(dic) {
        this.setState(dic)
    }

    load() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.lisener = DeviceEventEmitter.addListener('ACTION_HOME', (action, params) => {
            this.onAction(action, params)
        });
        this.props.navigation.setParams({
            handleSave: () => {
                this.onRightButtonClick()
            }
        });
        this.load();
    }

    /**
     * 通知回调事件处理
     */
    onAction(action, params) {
        if (ACTION_HOME.A_RESTART === action) {
            this.updataState({
                isChange: true
            });
            this.load();
        }
        else if (ACTION_HOME.A_SHOW_TOAST === action) {
            this.toast.show(params.text, DURATION.LENGTH_LONG)
        }
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    render() {
        let content = this.state.languages.length > 0 ? <ScrollableTabView
            renderTabBar={() => <ScrollableTabBar/>}
            tabBarBackgroundColor={'#03A9F4'}
            tabBarTextStyle={{ color: '#FFFFFF' }}
            tabBarUnderlineStyle={{ backgroundColor: '#0288D1' }}
        >
            {this.state.languages.map((result, i, arr) => {
                let lan = arr[i];
                return lan.checked ?
                    <PopularTab tabLabel={lan.name} key={i} {...this.props}
                                isChange={this.state.isChange}>{lan.name}</PopularTab> : null
            })}
        </ScrollableTabView> : null;
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => this.props.navigation.navigate('Chat', {
                        user: 'Lucy',
                        ...this.props
                    })}
                    title="Chat with Lucy"
                />
                <StatusBar
                    backgroundColor="white"
                    barStyle="light-content"
                />
                {content}
                <Toast style={styles.toast} ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isLoading: false,
            favoriteKeys: [],
            isFavoriteChanged: false,
        };
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
    }

    /**
     * 更新project的每一项的收藏状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSourceWay(projectModels)
        })

    }

    getDataSourceWay(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.updateState({ favoriteKeys: keys })
                }
                this.flushFavoriteState();
            }).catch((error) => {
            this.flushFavoriteState()
        })
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    loadData() {
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.setState({
            isLoading: true
        });
        this.dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();

                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }

            })
            .then((items) => {
                if (!items || items.length === 0) return;
                this.items = items;
                this.getFavoriteKeys();
                DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading: false
                });
            })
    };

    /**
     * FavoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteKeys(item.id.toString());
        }
    }

    onSelect(projectModel) {
        const { navigate } = this.props.navigation;
        navigate('RepositoryDetail', {
            data: projectModel,
            flag: FLAG_STORAGE.flag_popular,
            ...this.props,
            callback: (value) => {
                if (value) {
                    this.getFavoriteKeys();
                } else {
                }
            }
        });

    }

    /**
     * 设置全局监听事件
     */
    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isChange) {
            this.updateState({
                isLoading: true
            });
            this.loadData();
            this.toast.show('更新listview数据', DURATION.LENGTH_LONG);
        }
    }
    renderRowData(projectModel) {
        // console.log(projectModel);
        return (
            <RepositoryCell
                projectModel={projectModel}
                key={projectModel.item.id}
                onSelect={() => this.onSelect(projectModel)}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                {...this.props}
            />
        )
    }
    render() {
        return (
            <View style={styles.redText}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRowData(data)}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.loadData()}
                            color={['#2196f3']}
                            tintColor={'#2196f3'}
                            title={'Loading...'}
                            titleColor={'#2196f3'}
                        />
                    }
                />
                <Toast style={styles.toast} ref={(toast) => this.toast = toast}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 40,
    },
    TextInput: {
        height: 44
    },
    redText: {
        flex: 1
    },
    toast: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});