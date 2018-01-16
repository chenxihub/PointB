import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    StatusBar,
    Text
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DataRepository, {FLAG_STORAGE} from '../../util/DataRepository';
import Utils from '../../util/Utils';
import RepositoryCell from '../../common/RepositoryCell';
import TrendingCell from '../../common/TrendingCell';
import RepositoryDetail from '../RepositoryDetail'
import ProjectModel from '../../model/ProjectModel'
import FavoriteDao from '../../expand/FavoriteDao';
import ArrayUitls from '../../util/ArrayUtils'
import {DURATION} from "react-native-easy-toast";

export default class FavoritePage extends Component {
    static navigationOptions = {
        title: '收藏',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        let content = <ScrollableTabView
            renderTabBar={() => <ScrollableTabBar/>}
            tabBarBackgroundColor={'#03A9F4'}
            tabBarTextStyle={{ color: '#FFFFFF' }}
            tabBarUnderlineStyle={{ backgroundColor: '#0288D1' }}
        >

            <FavoritePageTab tabLabel='热门' {...this.props} flag={FLAG_STORAGE.flag_popular}/>
            <FavoritePageTab tabLabel='趋势' {...this.props} flag={FLAG_STORAGE.flag_trending}/>

        </ScrollableTabView>;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="light-content"
                />
                {content}
            </View>
        )
    }
}

class FavoritePageTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems=[];
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isLoading: false,
            favoriteKeys: [],
            isFavoriteChanged: false,

        };
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    onRefresh() {
        this.loadData(true);
    }

    loadData(isShowLoading) {
        if (isShowLoading) {
            this.setState({
                isLoading: true,
            });
        }
        this.favoriteDao.getAllItems().then((items) => {
            let resultData = [];
            for (let i = 0; i < items.length; i++) {
                resultData.push(new ProjectModel(items[i], true))
            }
            this.updateState({
                isLoading: false,
                dataSource: this.getDataSource(resultData)
            })
        }).catch((error) => {
            this.updateState({
                isLoading: false
            })
        })

    };

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    componentDidMount() {
        this.loadData(true);
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(false)
    }

    renderRowData(projectModel) {
        if (projectModel.item.fullName) {
            return (
                <TrendingCell
                    projectModel={projectModel}
                    key={projectModel.item.fullName}
                    onSelect={() => this.onSelect(projectModel)}
                    onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                    {...this.props}
                />
            )
        } else if (projectModel.item.id) {
            return (
                <RepositoryCell
                    projectModel={projectModel}
                    key={projectModel.item.id}
                    onSelect={() => this.onSelect(projectModel)}
                    onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                    {...this.props}
                />
            )
        } else {
            return null
        }

    }

    /**
     * FavoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (item.fullName) {
            if (isFavorite) {
                this.favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
                this.getFavoriteKeys();
            } else {
                this.favoriteDao.removeFavoriteKeys(item.fullName);
                this.getFavoriteKeys();
            }

        } else if (item.id) {
            if (isFavorite) {
                this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
                this.getFavoriteKeys();
            } else {
                this.favoriteDao.removeFavoriteKeys(item.id.toString());
                this.getFavoriteKeys();
            }
        }
        ArrayUitls.updateArray(this.unFavoriteItems, item);
        if (this.unFavoriteItems.length > 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChanged_popular');
            } else {
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }
        }

    }

    getFavoriteKeys() {
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.updateState({ favoriteKeys: keys })
                }
                this.flushFavoriteState();
            }).catch((error) => {
            this.flushFavoriteState()
        })
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

    onSelect(projectModel) {
        const { navigate } = this.props.navigation;
        navigate('RepositoryDetail', {
            data: projectModel,
            flag: FLAG_STORAGE.flag_popular,
            callback: (value) => {
                this.setState({
                    isFavoriteChanged: value
                })
            }
        });

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
                            onRefresh={() => this.onRefresh()}
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
//
// const StartNavigator = StackNavigator({
//     Home: {
//         screen: FavoritePageHome,
//     },
//     RepositoryDetail: {
//         screen: RepositoryDetail
//     }
//
// });
//
//
// export default StartNavigator;


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
        height: 600
    }
});