import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DataRepository from '../util/DataRepository';
import RepositoryCell from '../common/RepositoryCell';

import LanguageDao, {FLAG_LANGUAGE} from '../expand/LanguageDao';


const URL = 'https://api.github.com/search/repositories?q=';
const URL2 = 'https://api.douban.com/v2/movie/';
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
                return lan.checked ? <PopularTab tabLabel={lan.name} key={i}>{lan.name}</PopularTab> : null
            })}
        </ScrollableTabView> : null;
        return (
            <View style={styles.container}>
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
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items),
                    isLoading: false,
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    };

    componentDidMount() {
        this.loadData();
    }

    renderRowData(data) {
        return (
            <RepositoryCell data={data}/>
        )
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
});


export default class PopularPage extends Component {
    render() {
        return (
            <StartNavigator/>
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
        height: 600
    }
});