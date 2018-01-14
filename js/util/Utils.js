/**
 * 检查该item 有没有被收藏过
 */
export default class Utils {
    static checkFavorite(item, items) {
        for (let i = 0, len = items.length; i < len; i++) {
            let id = item.id ? item.id.toString() : item.fullName;
            if (id === items[i]) {
                return true;
            }
        }
        return false;
    }
}