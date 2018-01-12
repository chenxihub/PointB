import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AsyncStorage
} from 'react-native';
import {StackNavigator} from "react-navigation";
import Toast, {DURATION} from 'react-native-easy-toast';

const KEY = 'text';

class AsyncStoragePage extends Component {
    static navigationOptions = {
        title: 'AsyncStorageTest',
        //deep:#0288D1  red:#FF5252
        headerTintColor: '#FFFFFF',
        headerStyle: {
            backgroundColor: '#03A9F4'
        }
    };

    onSave() {
        AsyncStorage.setItem('KEY', this.text, (error) => {
            if (!error) {
                this.toast.show('保存成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('保存失败', DURATION.LENGTH_LONG);
            }
        })
    }

    onRemove() {
        AsyncStorage.removeItem('KEY', (error) => {

            if (!error) {
                this.toast.show('移除成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('移除失败', DURATION.LENGTH_LONG);
            }
        })
    }

    OnFetch() {
        AsyncStorage.getItem('KEY', (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    this.toast.show('取出的内容为：' + result, DURATION.LENGTH_LONG);

                } else {
                    this.toast.show('取出的内容为空', DURATION.LENGTH_LONG);
                }

            } else {
                this.toast.show('取出失败', DURATION.LENGTH_LONG);
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={{ height: 44, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 6, margin: 8 }}
                        onChangeText={text => this.text = text}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                        style={styles.tips}
                        onPress={() => this.onSave()}
                    >保存</Text>
                    <Text
                        style={styles.tips}
                        onPress={() => this.onRemove()}
                    >移除</Text>
                    <Text
                        style={styles.tips}
                        onPress={() => this.OnFetch()}
                    >取出</Text>
                </View>
                <Toast ref={toast => this.toast = toast} style={styles.toast}/>
            </View>
        )
    }
}


const StartNavigator = StackNavigator({
    Home: {
        screen: AsyncStoragePage,
    },
});


export default class AsyncStorageTest extends Component {
    render() {
        return (
            <StartNavigator/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
    },
    toast: {
        position: 'absolute',
        bottom: 60,
    }
});