//deep:#0288D1  red:#FF5252
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    WebView,
    TextInput,
    DeviceEventEmitter,
    ScrollView,
    Image,
    TouchableOpacity, I18nManager,
    ListView,
    ActivityIndicator
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import FavoriteDao from '../expand/FavoriteDao';
import {FLAG_STORAGE} from '../util/DataRepository';
import Utils from "../util/Utils";
import ProjectModel from "../model/ProjectModel";
import RepositoryCell from '../common/RepositoryCell';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=start';
export default class RepositoryDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({ header: null })
    };

    constructor(props) {
        super(props);
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.favoriteKeys = [];
        this.state = {
            rightButtonText: '搜索',
            isFavoriteChanged: false,
            isLoading: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        };
    }

    loadData() {
        this.updateState({
            isLoading: true
        });
        fetch(this.getFetchUrl(this.searchText))
            .then(res => res.json())
            .then(resData => {
                if (!this || !resData || !resData.items || resData.length === 0) {
                    this.toast.show(this.searchText + '什么都没有找到', DURATION.LENGTH_LONG);
                    this.updateState({
                        isLoading: false,
                        rightButtonText: '搜索'
                    });
                    return;
                }
                this.items = resData.items;
                this.getFavoriteKeys();
            }).catch(e => {
            this.updateState({
                rightButtonText: '搜索',
                isLoading: false
            })
        })
    }

    getFavoriteKeys() {
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                this.favoriteKeys = keys ? keys : [];
                // alert('keys:' + keys);
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
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSourceWay(projectModels),
            rightButtonText: '搜索'
        })

    }

    getDataSourceWay(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    getFetchUrl(key) {
        return API_URL + key + QUERY_STR;
    }

    updateState(obj) {
        this.setState(obj)
    }

    Search_Click() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({
                rightButtonText: '取消'
            });
            this.loadData()
        } else {
            this.updateState({
                rightButtonText: '搜索',
                isLoading: false
            })
        }
    };

    //跳转下一级页面
    onSelect(projectModel) {
        const { navigate } = this.props.navigation;
        navigate('RepositoryDetail', {
            data: projectModel,
            flag: FLAG_STORAGE.flag_popular,
            ...this.props,
            callback: (value) => {
                if (value) {
                    // alert('回调函数带回来的参数：'+value + '将刷新数据');
                    this.getFavoriteKeys();
                } else {
                    // alert('不用刷新数据')
                }
            }
        });

    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
            // this.getFavoriteKeys();
        } else {
            this.favoriteDao.removeFavoriteKeys(item.id.toString());
            // this.getFavoriteKeys();
        }
    }

    renderRowData(projectModel) {
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
        const { goBack } = this.props.navigation;
        let Header = (<View>
            <View style={{ backgroundColor: '#03A9F4', height: 20 }}/>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        this.refs.input.blur();
                        goBack();
                    }}
                >
                    <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: 'transparent', }}>
                        <Image
                            style={[styles.icon, { tintColor: 'white' }]}
                            source={require('../../res/assest/back-icon.png')}
                        />
                    </View>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='Please input'
                    ref='input'
                    onChangeText={text => this.searchText = text}
                />
                <TouchableOpacity
                    onPress={() => {
                        this.refs.input.blur();
                        this.Search_Click()
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{ fontSize: 17, paddingRight: 10, color: 'white' }}
                    >{this.state.rightButtonText}</Text>
                </TouchableOpacity>
            </View>
        </View>);
        let listView = this.state.isLoading ? null : <ListView
            dataSource={this.state.dataSource}
            renderRow={(data) => this.renderRowData(data)}
        />;
        let Indicator = this.state.isLoading ? <ActivityIndicator
            style={styles.centering}
            size='large'
            animating={this.state.isLoading}
        /> : null;
        return (
            <View style={styles.container}>
                {Header}
                <View style={styles.redText}>
                    {listView}
                    {Indicator}
                </View>
                <View>
                    <Toast ref={(e) => this.toast = e}/>
                </View>
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
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        height: 44,
        justifyContent: 'space-between',
        backgroundColor: '#03A9F4',
    },
    input: {
        borderWidth: 0.6,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 60,
        paddingLeft: 15,
        flex: 1,
        paddingTop: 6,
        paddingBottom: 5,
        marginLeft: 15,
        marginRight: 10,
        fontSize: 14,
        alignItems: 'center'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex:1,
        marginTop:80
    }
});