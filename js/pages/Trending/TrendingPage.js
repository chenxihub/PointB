import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    StatusBar,
    TouchableHighlight,
    TouchableOpacity,
    Text
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
//获取数据（包含本地，网络，数据库）
import DataRepository, {FLAG_STORAGE} from '../../util/DataRepository';
//通用类
import TrendingCell from '../../common/TrendingCell';
//获取本地Json标签或者数据库标签
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/LanguageDao';
//详情页
import RepositoryDetail from '../RepositoryDetail'
//弹出层
//TimeSpan方法
import TimeSpan from '../../model/TimeSpan'

import ProjectModel from '../../model/ProjectModel'

import FavoriteDao from '../../expand/FavoriteDao';

import Utils from "../../util/Utils";


let timeSpanTextArray = [new TimeSpan('今天', 'since = daily'),
    new TimeSpan('本周', 'since = Weekly'),
    new TimeSpan('本月', 'since = monthly')];

const API_URL = 'https://github.com/trending/';
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

export default class TrendingPage extends Component {
    static navigationOptions = ({ navigation }) => {
        let title = 'Trending';
        return {
            title: title,
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
        };
    };


    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0]
        };
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
        this.load();
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan: timeSpan
        })
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
                    <TrendingTab tabLabel={lan.name} key={i} {...this.props}
                                 timeSpan={this.state.timeSpan}>{lan.name}</TrendingTab> : null
            })}
        </ScrollableTabView> : null;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="light-content"
                />
                {content}
                {timeSpanTextArray.map((result, i, arr) => {
                    return (<TouchableOpacity
                        key={i}
                        onPress={() => this.onSelectTimeSpan(arr[i])}
                    >
                        <View
                            style={styles.row}><Text>{arr[i].showText}</Text>
                        </View>
                    </TouchableOpacity>)
                })}
            </View>
        )
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isLoading: false,
            favoriteKeys: [],
            isFavoriteChanged: false,
        };

    }

    componentDidMount() {
        this.lisener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.setState({
                isFavoriteChanged: true
            })
            // .isFavoriteChanged = true;
        });
        this.loadData(this.props.timeSpan, true);
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isFavoriteChanged) {
            // this.isFavoriteChanged = false;
            this.setState({
                isFavoriteChanged: false
            });
            this.getFavoriteKeys();
        }
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan)
        }


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

    loadData(timeSpan, isRefresh) {
        // alert(JSON.stringify(timeSpan));
        let url = this.getFetchUrl(timeSpan, this.props.tabLabel);
        this.setState({
            isLoading: true
        });
        dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();

                if (!this.items || isRefresh && result.update_date && !dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }

            })
            .then((items) => {
                if (!items || items.length === 0) return;
                this.getFavoriteKeys();
                DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading: false
                });
            })
    }
    ;

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    onRefreshData() {
        // alert(JSON.stringify(this.props.timeSpan))
        this.loadData(this.props.timeSpan, true)
    }

    getFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText
    }


    renderRowData(projectModel) {
        // console.log(projectModel);
        return (
            <TrendingCell
                projectModel={projectModel}
                key={projectModel.item.fullName}
                onSelect={() => this.onSelect(projectModel)}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                {...this.props}
            />
        )
    }

    /**
     * FavoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteKeys(item.fullName);
        }
    }

    onSelect(projectModel) {
        const { navigate } = this.props.navigation;
        navigate('RepositoryDetail', {
            data: projectModel,
            flag: FLAG_STORAGE.flag_trending,
            callback: (value) => {
                if (value){
                    // alert('回调函数带回来的参数：'+value + '将刷新数据');
                    this.getFavoriteKeys();
                }else {
                    // alert('不用刷新数据')
                }
            }
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRowData(data)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.onRefreshData()}
                            color={['#2196f3']}
                            tintColor={'#2196f3'}
                            title={'Loading...'}
                            titleColor={'#2196f3'}
                        />
                    }
                />
            </View>
        )
    }
}


const
    styles = StyleSheet.create({
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
            height: 600
        },
        button: {
            borderRadius: 4,
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: '#ccc',
            borderColor: '#333',
            borderWidth: 1,
        },
        buttonText: {},
        row: {
            flexDirection: 'row',
            borderRadius: 4,
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: '#ccc',
            borderColor: '#333',
            borderWidth: 1,
            alignItems: 'center'
        }
    });