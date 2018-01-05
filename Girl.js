import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button
} from 'react-native';

export default class Girl extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        const isInfo = state.params.mode === 'info';
        const { word } = state.params;
        return {
            title: isInfo ? `${word}` : `${state.params.word}`,
            headerRight: (
                <Button
                    title={isInfo ? 'Done' : `${word}`}
                    onPress={() => setParams({
                        mode: isInfo ? 'none' : 'info'
                    })}
                />
            ),
        };
    };

    render() {
        const { state: { params }, goBack } = this.props.navigation;
        return (
            <View
                style={styles.container}
            >
                <Text style={styles.text}>I am Girl</Text>
                <Text style={styles.text}>我收到了男孩送的：{params.word}</Text>
                <Button
                    style={styles.text}
                    title='回馈巧克力'
                    onPress={() => {
                        params.callback('一盒巧克力');
                        goBack();
                    }}
                />

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
    }
});