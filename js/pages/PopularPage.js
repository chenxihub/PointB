import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    StatusBar
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DataRepository from '../util/DataRepository';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/LanguageDao';
import RepositoryDetail from './RepositoryDetail'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=start';

class PopularHome extends Component {
    static navigationOptions = {
        title: 'Popular',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: []
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
                    <PopularTab tabLabel={lan.name} key={i} {...this.props}>{lan.name}</PopularTab> : null
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

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isLoading: false,
        };
        this.dataRepository = new DataRepository;
    }

    loadData() {
        let url = URL + this.props.tabLabel + QUERY_STR;
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

    componentDidMount() {
        this.loadData();
    }


    renderRowData(data) {
        console.log(data);
        return (
            <RepositoryCell
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
        screen: PopularHome,
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
    }
});