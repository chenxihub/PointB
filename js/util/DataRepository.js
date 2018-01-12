/**
 *
 * 本地缓存数据
 * 网络数据
 * 数据过时
 *
 */
import {
    AsyncStorage,
} from 'react-native';

export default class DataRepository {
    /**
     * 获取网络数据，本地数据，数据库缓存
     * @param url
     * @returns {Promise<any>}
     */
    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地数据
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result);
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(e => {
                            reject(e);
                        })
                )
        })
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise<any>}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error)
                }
            })
        })
    }

    /**
     * 获取网络数据
     * @param url
     * @returns {Promise<any>}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (!result) {
                        resolve(new Error('RepositoryData a is null'));
                        return
                    }
                    resolve(result.items);
                    this.saveRepository(url, result.items)
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    /**
     * 存储数据到本地缓存
     * @param url
     * @param items
     * @param callback
     */
    saveRepository(url, items, callback) {
        if (!url || !items) return;
        let wrapData = { items: items, update_date: new Date().getTime() };
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */

    checkDate(longTime) {
        // return false;
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }
}