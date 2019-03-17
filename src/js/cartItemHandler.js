export default class cartItemHandler {

    static getItem(id) {
        return $('.j-order-wrapper').find(`.j-order-item[data-id="${id}"]`);
    }

    static add(id, price) {
        const item = this.getItem(id);
        let value = Number(item.find('.j-value').text());
        $(item).find('.j-value').text(++value);
        item.find('.j-price').text(price);
    }

    static remove(id, price) {
        const item = this.getItem(id);
        let value = Number(item.find('.j-value').text());
        if (value <= 1) {
            item.remove();
        }
        $(item).find('.j-value').text(--value);
        item.find('.j-price').text(price);
    }

    static removeAll() {
        $('.j-order-wrapper').html('');
    }

}