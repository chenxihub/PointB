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


let timeSpanTextArray = [new TimeSpan('今天', 'since = daily'),
    new TimeSpan('本周', 'since = Weekly'),
    new TimeSpan('本月', 'since = monthly')];

const API_URL = 'https://github.com/trending/';

class TrendingPage extends Component {
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
                    <TrendingTab tabLabel={lan.name} key={i} {...this.props}>{lan.name}</TrendingTab> : null
            })}
        </ScrollableTabView> : null;
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

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isLoading: false,
        };
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
    }

    loadData() {
        let url = this.getFetchUrl('?since=daily', this.props.tabLabel);
        this.setState({
            isLoading: true
        });
        this.dataRepository
            .fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });

                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }

            })
            .then((items) => {
                if (!items || items.length === 0) return;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    isLoading: false
                });
            })
    };

    getFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText
    }

    componentDidMount() {
        this.loadData();
    }


    renderRowData(data) {
        return (
            <TrendingCell
                data={data}
                key={data.id}
                onSelect={() => this.onSelect(data)}
                {...this.props}
            />
        )
    }

    onSelect(data) {
        const { navigate } = this.props.navigation;
        navigate('RepositoryDetail', {
            data: data
        });

    }

    render() {
        return (
            <View style={styles.redText}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRowData(data)}
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
            </View>
        )
    }
}

const StartNavigator = StackNavigator({
    Home: {
        screen: TrendingPage,
    },
    RepositoryDetail: {
        screen: RepositoryDetail
    }

});


export default StartNavigator;


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
    buttonText: {}
});