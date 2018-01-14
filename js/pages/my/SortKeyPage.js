import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    Alert,
    Button
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import SortableListView from 'react-native-sortable-listview'
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/LanguageDao";
import ArrayUtils from "../../util/ArrayUtils";

export default class SortKeyPage extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state: { params }, goBack } = navigation;
        let title = params.flag === FLAG_LANGUAGE.flag_key ? '标签排序' : '语言排序';
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
        this.dataArray = [];
        this.sortResultArray = [];
        this.originalCheckedArray = [];
        this.state = {
            checkedArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.navigation.state.params.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then((result) => {
                //
                this.getCheckedItems(result);
            })
            .catch(error => {

            })
    }

    getCheckedItems(dataArray) {
        this.dataArray = dataArray;
        let checkedArray = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray
        });
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    onBack() {
        const { goBack } = this.props.navigation;
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            goBack();
            return;
        } else {
            // iOS和Android上都可用
            Alert.alert(
                '提示',
                '要保存修改吗？',
                [
                    {
                        text: '取消', onPress: () => {
                            goBack();
                        }, style: 'cancel'
                    },
                    { text: '确定', onPress: () => this.onSave(true) },
                ],
                { cancelable: false }
            )
        }
    }

    onSave(isChecked) {
        const { goBack } = this.props.navigation;
        if (!isChecked) {
            if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
                goBack();
                return;
            }

        } else {
            this.getSortResult();
            this.languageDao.save(this.sortResultArray);
            goBack();
        }
    }

    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for (let i = 0, j = this.originalCheckedArray.length; i < j; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title='Save'
                    onPress={() => {
                        this.onBack()
                    }}
                />
                <SortableListView
                    style={{ flex: 1 }}
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={e => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate()
                    }}
                    renderRow={row => <SortCell data={row}/>}
                />
            </View>
        )
    }
}

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        source={require('./checked/ic_sort.png')}
                    />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
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
    },
    item: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        tintColor: '#03A9F4',
        width: 14,
        height: 14,
        marginRight: 15,
    }
});