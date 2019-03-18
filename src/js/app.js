import './../scss/style.scss';
import 'owl.carousel';
import 'owl.carousel/src/scss/owl.carousel.scss';
import Popup from './popup';
import Basket from './basket';
import itemHandler from './itemHandler';
import cartItemHandler from './cartItemHandler';


$(window).on('load', function() {
    
    //обрезка описания
    (function($string) {
        if(!$string.length) {
            return;
        }

        let text = $string.text();
        const template = `<span class="product-card__dscr-more-btn">подробнее</span>`;
        if(text.length > 90) {
            text = $string.text().substr(0, 80);
            $string.html(`${text}... ${template}`)
        }
    })($('.j-product-dscr'));

    //инициализация попапа
    (function($popupWrapper) {
        if (!$popupWrapper.length) {
            return false;
        }

        const popup = new Popup();
        $('.j-product-dscr').on('click', function() {
            const id = $(this).closest('.j-product-item').data('id');
            $.ajax({ //тут должен быть запрос к серверу с передачей id товара, сейчас просто заглушка 
                url: 'www/data.json',
                success: (data) => {
                    popup.init(data[id]);
                },
                error: (err) => {
                    console.log(`oops ${err}`);
                }
            });
        });

    })($('.j-popup-wrapper'));

    //корзина товаров
    (function($basket) {
        if (!$basket.length) {
            return;
        }

        const cart = new Basket($basket);

        cart.$basket.on('add', function (event, id, price) {//есть возможность раширять логику, просто добавив сюда обработчик(например какой нибудь запрос к серверу)
            cartItemHandler.add(id, price);
            itemHandler.add(id);
        });
        
        cart.$basket.on('removeItem', function (event, id, price) {//есть возможность раширять логику, просто добавив сюда обработчик(например какой нибудь запрос к серверу)
            cartItemHandler.remove(id, price);
            itemHandler.remove(id);
        });

        cart.$basket.on('removeAll', function() {
            cartItemHandler.removeAll();
            itemHandler.removeAll();
        });

        $('.j-product-list').on('click', '.j-add', function() {
            const id = $(this).closest('.j-product-item').data('id');
            cart.addItem(id);
        });

        $('.j-product-list').on('click', '.j-remove', function () {
            const id = $(this).closest('.j-product-item').data('id');
            cart.removeItem(id);
        });

        $('.j-product-list').on('click', '.j-product-img', function () {
            const id = $(this).closest('.j-product-item').data('id');
            cart.addItem(id);
        });


        $('.j-order-wrapper').on('click', '.j-add', function() {
            const id = $(this).closest('.j-order-item').data('id');
            cart.addItem(id);
        });

        $('.j-order-wrapper').on('click', '.j-remove', function () {
            const id = $(this).closest('.j-order-item').data('id');
            cart.removeItem(id);
        });

        $('.j-clear-btn').on('click', function() {
            cart.removeAll();
        });

    })($('.j-basket'));

    //скролл
    (function($slider) {
        if (!$slider.length) {
            return;
        }
        if ($(document).width() > 1023) {
            $slider.owlCarousel({ 
                margin: 30,
                loop: false,
                autoWidth: true,
                items: 5
            })
            .on('mousewheel', '.owl-stage', function (event) {
                event.preventDefault();
                if (event.originalEvent.wheelDelta < 0) {
                    $(this).trigger('next.owl');
                } else {
                    $(this).trigger('prev.owl');
                }
            });
        } else {
            $('.owl-carousel').removeClass('owl-carousel');
        }
    })($('.j-category-list'));

    //скрол на мобильных 
    (function($button) {
        if (!$button.length || $(document).width() > 1023) {
            return false;
        }

        const $list = $('.j-category-list');
        $button.on('click', function(event) {
            event.stopPropagation();
            $list.show('fast');
            $(this).hide();
        });

        $(document).on('click', function(event) {
            if ($(event.target).closest('.j-category-list').length) {
                return
            } else {
                event.stopPropagation();
                $button.show();
                $list.hide('fast');
            }
        })
    })($('.j-icon-filter'));
    
    //фильтрация
    (function($filter) {
        if (!$filter.length) {
            return;
        }

        $filter.on('click', 'button', function() {
            $filter.find('button').removeClass('active');
            $(this).addClass('active');
            const that = this;
            let counter = 0;
            $('.j-product-ttl').text($(this).text());
            
            $('.j-product-item').each( function() {
                if (!$(that).data('alt')) { //показываем всё если атрибут пустой
                    $(this).show('fast');
                    counter++;
                }
                else if ($(this).data('alt') === $(that).data('alt')) {
                    $(this).show('fast');
                    counter++;
                } else {
                    $(this).hide('fast');
                }
            });
            $('.j-product-cntr').text(counter);
        });

    })($('.j-category-list'));

    //сортировка
    (function($sort) {
        if (!$sort.length) {
            return;
        }

        $sort.on('click', function() { // сортировок может быть несколько. нужно чтобы у кнопки и сортируемых элементов было одинаковое значение data-sort
            $(this).toggleClass('incr');
            const method = $(this).data('sort');
            let sortCollect;
            if ($(this).hasClass('incr')) {
                sortCollect = $('.j-product-item').sort(function (a, b) {
                    return Number($(a).data(method)) < Number($(b).data(method)) ? 1 : -1;
                })
            } else {
                sortCollect = $('.j-product-item').sort( function(a, b) {
                    return Number($(a).data(method)) > Number($(b).data(method)) ? 1 : -1;
                });
            }
            $('.j-product-list').html(sortCollect);
        })
    })($('.j-sort'));

    //заказ на мобильных 
    (function($btn) {
        if(!$btn.length) {
            return;
        }

        $btn.on('click', function() {
            $btn.hide();
            $('section.order').addClass('show');
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    })($('.j-order-btn'));

    //кнопка навигации на мобильных
    (function($navBtn) {
        if (!$navBtn.length) {
            return;
        }

        $navBtn.on('click', function() {
            $('.j-header-nav').toggleClass('is-active');
            $('.j-header-overlay').toggle();
            $('body').toggleClass('is-hidden');
        });
    })($('.j-nav-btn'));

});