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


export default class KeyPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.state = {
            text: '',
            dataArray: [],
        };
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    }

    static navigationOptions = ({ navigation }) => {
        const { state: { params }, goBack } = navigation;
        let title = params.isRemoveKey ? 'RemoveKey' : 'CustomerKeyPage';
        return {
            title: title,
            headerTintColor: '#FFFFFF',
            headerStyle: {
                backgroundColor: '#03A9F4'
            },
        };
    };

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch().then((data) => {
            this.setState({
                dataArray: data
            })
        }).catch((error) => {
            console.log(error);
        });
    }

    /***
     *
     * @param data
     */
    onClick(data) {
        const { state: { params } } = this.props.navigation;
        if (params.isCustomerKey) {
            data.checked = !data.checked;
        }
        ArrayUtils.updateArray(this.changeValues, data)
    }


    onSave() {
        const { state: { params }, goBack } = this.props.navigation;
        if (this.changeValues.length === 0) {
            goBack();
            return;
        }
        if (params.isRemoveKey) {
            // alert(params.isRemoveKey);
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
            }
        } else if (params.isCustomerKey) {
            // alert(params.isCustomerKey);
            this.languageDao.save(this.state.dataArray);
        }
        this.languageDao.save(this.state.dataArray);
        // alert(JSON.stringify(this.state.dataArray))
        goBack();

    }

    onBack() {
        const { navigate, state: { params }, goBack } = this.props.navigation;
        if (this.changeValues.length > 0) {
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
                    {
                        text: '确定', onPress: () => {
                            this.onSave()
                        }
                    },
                ],
                { cancelable: false }
            )

        } else {
            goBack();
            return;
        }
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
        )
        return views;

    }

    renderCheckBox(data) {
        const { state: { params } } = this.props.navigation;
        let leftText = data.name;
        let isChecked = params.isRemoveKey ? false : data.checked;
        return (
            <CheckBox
                style={{ flex: 1, padding: 10 }}
                onClick={() => this.onClick(data)}
                leftText={leftText}
                isChecked={isChecked}
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


    render() {
        const { navigate, state: { params }, goBack } = this.props.navigation;
        let title = params.isRemoveKey ? 'Remove' : 'Save';
        return (
            <View style={styles.redText}>
                <Button
                    title={title}
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