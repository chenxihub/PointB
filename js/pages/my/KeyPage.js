import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import CheckBox from 'react-native-check-box';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/LanguageDao';
import ArrayUtils from '../../util/ArrayUtils';


export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.state = {
            text: '',
            dataArray: []
        };
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    }

    static navigationOptions = ({ navigation }) => {
        const { state: { params }, goBack } = navigation;
        return {
            title: 'KeyPage',
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
        };
    };


    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray: result
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) return;
        let len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        );
        return views;

    }

    onClick(data) {
        data.checked = !data.checked;
        ArrayUtils.updateArray(this.changeValues, data)
    }


    renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{ flex: 1, padding: 10 }}
                onClick={() => this.onClick(data)}
                leftText={leftText}
                isChecked={data.checked}
                checkedImage={
                    <Image
                        style={{ tintColor: '#03A9F4' }}
                        source={require('./checked/ic_check_box.png')}
                    />
                }
                unCheckedImage={
                    <Image
                        style={{ tintColor: '#03A9F4' }}
                        source={require('./checked/ic_check_box_outline_blank.png')}
                    />
                }
            />

        )
    }

    onSave() {
        const { navigate, state: { params }, goBack } = this.props.navigation;
        if (this.changeValues.length === 0) {
            goBack();
            return;
        }
        this.languageDao.save(this.state.dataArray);
        goBack();
    }

    onBack() {
        const { navigate, state: { params }, goBack } = this.props.navigation;
        if (this.changeValues === 0) {
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
                    { text: '确定', onPress: () => this.onSave() },
                ],
                { cancelable: false }
            )
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { navigate, state: { params }, goBack } = this.props.navigation;
        return (
            <View style={styles.redText}>
                <Button
                    title='保存'
                    onPress={() => {
                        this.onBack();
                    }}
                />
                <Text>
                {JSON.stringify(this.state.dataArray)}
                </Text>
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
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
        height: 600
    },
    whiteColor: {
        color: 'white'
    },
    line: {
        height: 0.3,
        backgroundColor: '#f0f0f0',

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});