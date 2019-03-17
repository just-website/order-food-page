export default class Popup {
    constructor() {
        this.$wrapper = $('.j-popup-wrapper');
        this.$popup = this.$wrapper.find('.j-popup');

    }

    init(data) {
        this.setTemplate(data);
        this.$popup.html(this.template);
        this.bindEvent();
        this.showAnimation();
    }

    bindEvent() {
        this.setElems();
        this.$closeBtn.on('click', this.close.bind(this));
    }

    setElems() {
        this.$closeBtn = this.$wrapper.find('.j-close-popup');
        this.template = '';
    }

    setTemplate(data) {
        this.template = `
            <div class="popup__close j-close-popup">
            </div>
            <div class="popup__img">
                <img class="j-img" src="${data.url}" alt="">
            </div>
            <div class="popup__dscr-wrap">
                <div class="popup__dscr-ttl">${data.title} <span>${data.weight}</span></div>
                <div class="popup__dscr-subttl">Описание</div>
                <div class="popup__dscr">${data.discription}</div>
                <div class="popup__dscr-subttl">Состав</div>
                <div class="popup__dscr">${data.content}</div>
                <div class="popup__dscr-subttl">Пищевая ценность</div>
                <div class="popup__val-wrap">
                    <div class="popup__val-item">
                        <div class="popup__val-ttl">${data.value.cal}</div>
                        <div class="popup__val-dscr">ккал</div>
                    </div>
                    <div class="popup__val-item">
                        <div class="popup__val-ttl">${data.value.bel}</div>
                        <div class="popup__val-dscr">белки</div>
                    </div>
                    <div class="popup__val-item">
                        <div class="popup__val-ttl">${data.value.zhir}</div>
                        <div class="popup__val-dscr">жиры</div>
                    </div>
                    <div class="popup__val-item">
                        <div class="popup__val-ttl">${data.value.ugl}</div>
                        <div class="popup__val-dscr">углеводы</div>
                    </div>
                </div>
            </div>
        `;
    }

    showAnimation() {
        this.$wrapper.css('display', 'block');
        
        this.$popup.slideDown(400, () => {
            // this.$popup.find('.j-img').slideDown(250);
            $('body').css('overflow', 'hidden');
        });
    }

    close() {
        this.$popup.slideUp(250, () =>{
            this.$wrapper.css('display', 'none');
            $('body').css('overflow', 'visible');
        });
    }
}