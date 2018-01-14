/**
 * RespositoryDao
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';
import keysData from '../../res/data/keys.json'
import langsData from '../../res/data/langs.json'

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
    constructor(flag) {
        this.flag = flag;
        this.favoriteKey = FAVORITE_KEY_PREFIX;
    }

    /**
     *
     * @param key
     * @param value
     * @param callback
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key, true)
            }
        })
    }

    /**
     * 更新Favoreite Key 集合
     * @param key 项目ID 或者名称
     * @param isAdd true 添加，false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result)
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key)
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1)
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }

    /**
     * 移除已经收藏的项目
     * @param key
     */
    removeFavoriteKeys(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false)
            }
        })
    }

    /**
     * 获取收藏的Repositoryd 对应的key
     * @returns {Promise<any>}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(error)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
}


