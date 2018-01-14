import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';


export default class RepositoryCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/img/ic_star.png') : require('../../res/img/ic_unstar_transparent.png')
        };
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/img/ic_star.png') : require('../../res/img/ic_unstar_transparent.png')
        })
    }

    OnPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        let favoriteButton = <TouchableOpacity
            onPress={() => {
                this.OnPressFavorite();
            }}
        >
            <Image
                source={this.state.favoriteIcon}
                style={[{ width: 16, height: 16, marginTop: 5 }, { tintColor: '#03A9F4' }]}
            />
        </TouchableOpacity>;
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.header}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Author : </Text>
                            <Image
                                style={{ height: 16, width: 16, borderRadius: 10 }}
                                source={{ uri: item.owner.avatar_url }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Stars : </Text>
                            <Text style={styles.title}>{item.stargazers_count}</Text>
                        </View>
                        {favoriteButton}
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