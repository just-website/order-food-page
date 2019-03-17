export default class itemHandler {
    
    static getItem(id) {
        return $('.j-product-list').find(`.j-product-item[data-id="${id}"]`);
    }
    
    static add(id) {
        const item = this.getItem(id);
        let value = Number(item.find('.j-value').text());
        $(item).find('.j-value').text(++value);
        if (value >= 1) {
            this.init(item);
        }
    }

    static remove(id) {
        const item = this.getItem(id);
        let value = Number(item.find('.j-value').text());
        $(item).find('.j-value').text(--value);
        if (value <= 0) {
            this.unInit(item);
        }
    }
    
    static init(item) {
        $(item).find('.j-remove').addClass('visible');
        $(item).find('.j-value').addClass('visible');
    }

    static unInit(item) {
        $(item).find('.j-remove').removeClass('visible');
        $(item).find('.j-value').removeClass('visible');
    }

    static removeAll() {
        $('.j-product-list').find('.j-product-item').each( (ind, elem) => {
            this.unInit($(elem));
            $(elem).find('.j-value').text(0);
        });
    }
}