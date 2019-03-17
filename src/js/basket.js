export default class Basket {
    constructor($elem) {
        this.$basket = $elem;
        this.$clear = this.$basket.find('.j-clear-btn');
        this.$orderWrapper = this.$basket.find('.j-order-wrapper');
        this.$totalPrice = this.$basket.find('.j-total-sum');
        this.$totalItems = $('.j-total-count, .j-order-btn-cnt');
        this.itemsList = {};
        this.active = false;
        
        this.$basket.on('submit', function(event) {
            event.preventDefault();
            console.log($(this).serialize());
        });
    }

    getDataItem(id) { //счетаю, что для корзины будет правильнее дёргать инфу с сервера (а не брать из HTML)
        return $.ajax({ //тут должен быть запрос к серверу с передачей id товара, сейчас просто заглушка 
            url: '/www/data.json'
        }).then(data => data[id])
        .fail(err => console.error(`oops: ${err}`));
    }

    async addItem(id) {
        const dataItem = await this.getDataItem(id);
        if (this.itemsList[id]) {//если такой элемент уже добавляли
            this.itemsList[id].count++;
        } else {
            this.itemsList[id] = dataItem;
            this.itemsList[id].count = 1;
            const newItem = this.createItem(dataItem);
            this.$orderWrapper.append(newItem);
        }
        this.$basket.trigger('add', [id, this.getPrice(id)]);
        this.getTotal();
        if(!this.active) {
            this.setActive();
        }
    }

    removeItem(id) {
        if (this.itemsList[id].count <= 1) {
            this.itemsList[id] = null;
        } else {
            this.itemsList[id].count--;
        }
        this.$basket.trigger('remove', [id, this.getPrice(id)]);
        this.getTotal();
    }

    removeAll() {
        this.itemsList = {};
        this.$basket.trigger('removeAll');
        this.getTotal();
        this.setDisActive();
    }

    setActive() {
        this.active = true;
        this.$basket.find('.order__form_wrapper_preview').hide();
        this.$basket.find('.order__form_wrapper_full').show();
    }

    setDisActive() {
        this.active = false;
        this.$basket.find('.order__form_wrapper_preview').show();
        this.$basket.find('.order__form_wrapper_full').hide();
    }

    getPrice(id) {
        if (this.itemsList[id]) {
            return this.itemsList[id].price * this.itemsList[id].count;
        } else return null;
    }

    getTotal() {
        let totalPrice = 0;
        let totalItems = 0;
        for (let item in this.itemsList) {
            if (this.itemsList[item]) {
                totalPrice += this.itemsList[item].price * this.itemsList[item].count;
                totalItems += this.itemsList[item].count;
            }
        }
        this.$totalItems.text(totalItems);
        this.$totalPrice.text(totalPrice);
    }

    createItem(data) {
        const template = //data.discription.split(' ')[0] - первое слово из описания, что бы не было переполнения
            `<div class="order__item j-order-item" data-id="${data.id}" >
                <input type="hidden" value="1" name="${data.id}">
                <div class="order__item-dscr">
                    ${data.discription.split(' ')[0]}
                <span class="order__item-dscr-weight">
                    ${data.weight}
                </span>
                </div>
                <div class="order__item-cntr">
                    <div class="order__item-cntr_up-arrow j-add"></div>
                    <div class="order__item-cntr-val j-value">0</div>
                    <div class="order__item-cntr_down-arrow j-remove"></div>
                </div>
                <div class="order__item-price">
                    <span class="j-price">${data.price}</span> &#8381;
                </div>
            </div>`
        return template;
    }
}