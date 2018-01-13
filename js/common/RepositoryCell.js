import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';


export default class RepositoryCell extends Component {
    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.header}>{this.props.data.full_name}</Text>
                    <Text style={styles.description}>{this.props.data.description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Author : </Text>
                            <Image
                                style={{ height: 16, width: 16, borderRadius: 10 }}
                                source={{ uri: this.props.data.owner.avatar_url }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Stars : </Text>
                            <Text style={styles.title}>{this.props.data.stargazers_count}</Text>
                        </View>
                        <View>
                            <Image
                                source={require('../../res/images/my/My_coin_icon.png')}
                                style={{ width: 16, height: 16, marginTop: 5 }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    title: {
        fontSize: 14,
        marginBottom: 2,
        color: '#999999',
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#999999',
        borderRadius: 2,
    },
    cell_container: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 5,
        borderWidth: 0.5,
        borderRadius: 6,
        borderColor: '#f0f0f0',
        shadowColor: '#f8f8f8',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    }
});