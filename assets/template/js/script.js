svg4everybody();
new WOW().init();

$(function () {
    // ===============================================
    // Страница 1
    // ===============================================
    if ($('.page-1').length) {
    }


    // ===============================================
    // page-main
    // ===============================================

    // ===============================================
    // Скрипты для всех страниц
    // ===============================================
    // --------------------------------
    // anchor-animate
    // --------------------------------
    $('.anchor-animate').on('click', function (e) {
        e.preventDefault();
        let $anchor = $($(e.target).attr('href'));
        if ($anchor.length) {
            $('html, body').animate({scrollTop: $anchor.offset().top - $('.header').outerHeight() + 20}, '300');
        }
    });

    // ------------------------------
    // Отправка формы
    // ------------------------------
    $('body').on('submit', 'form', function (e) {
        e.preventDefault();

        // ---------------------------
        // Проверка на повторную отправку (пользователь несколько раз жмет кнопку "Отправить")
        // ---------------------------
        let $this = $(this);
        if ($this.hasClass('js-sending')) {
            return;
        }

        let data = new FormData(this);

        // ---------------------------
        // Отправка
        // ---------------------------
        $this.addClass('js-sending');
        let $submit_btn = $this.find('button[type="submit"]');

        $submit_btn.data('message', $submit_btn.html());
        $submit_btn.html('Sending');

        $.ajax({
            type: "POST",
            url: "/mail.php",
            data: new FormData(this),
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                let message;
                let title;
                if (data.result == 'error') {
                    console.log('Ошибка при отправке почты');
                    message = data.message;
                    title = 'An error has occurred';
                }
                if (data.result == 'success') {
                    console.log('Почта успешно отправлена');
                    message = '';
                    title = '<span class="color-1">Thank</span> you!';
                    $this[0].reset();
                }

                let $popup;
                if ($this.hasClass('custom-popup__form')) {
                    $popup = $this.closest('.custom-popup');
                } else {
                    $popup = $popupMessage;
                    $popupMessage.euv_custom_popup('open');
                }

                if ($popup.length) {
                    $popup.addClass('custom-popup_success');
                    $popup.find('.custom-popup__success-message').html(message);
                    $popup.find('.custom-popup__header').html(title);

                    // Высота попапа изменилась. Но отступ сверху - нет. Применяем resize, чтобы изменился отступ (чтобы попап был посередине).
                    $(window).resize();
                }

                $submit_btn.html($submit_btn.data('message'));
                $this.removeClass('js-sending');
            },
            error: function (data) {
                console.log('Ошибка при отправке почты');
                console.log(data);
            }
        });
    });


    // --------------------------------
    // Меню
    // --------------------------------
    $('.header__menu-item_with-submenu .header__menu-link').on('click', function (e) {
        e.preventDefault();
        let $item = $(e.target).closest('.header__menu-item_with-submenu');
        $item.toggleClass('open');
        if (window.innerWidth <= 768) {
            $item.find('.header__submenu').slideToggle();
        }
    });


    // --------------------------------
    // Форма с файлом
    // --------------------------------
    let fileNumber = 2;
    let $lastAttach = $('.sect-callback__attach');

    // Вешаем обработчик на input с файлом
    let $fileInput = $lastAttach.find('.sect-callback__attach-input');
    $fileInput.on('change', function (evt) {
        // Меняем название и добавляем еще один input
        if (evt.target.files.length > 0) {
            addFileArea(evt);
        }
    });

    // Вешаем обработчик на крестик для удаления файла
    $lastAttach.find('.sect-callback__remove').on('click', function (e) {
        e.preventDefault();
        $(e.target).closest('.sect-callback__attach').remove();
    });

    // Функция для добавление файла
    function addFileArea(evt) {
        let $target = $(evt.target);
        let $attach = $target.closest('.sect-callback__attach');

        if (!$attach.hasClass('sect-callback__attach_not-empty')) {
            // Клонируем input
            let $clone = $lastAttach.clone(true);
            let id = 'sect-callback-attach-' + fileNumber;
            $clone.find('.sect-callback__attach-label').attr('for', id);
            $clone.find('.sect-callback__attach-input').attr('id', id);
            $clone.insertAfter($lastAttach);

            // Запрещаем добавлять новый input на onchange
            $lastAttach.addClass('sect-callback__attach_not-empty');

            // Меняем переменные
            fileNumber++;
            $lastAttach = $clone;
        }

        // Меняем текст
        $attach.find('.sect-callback__attach-text').html(evt.target.files[0].name);
    }


    // --------------------------------
    // Всплывашка для заказа обратного звонка
    // --------------------------------
    let $popupCallus = $('.popup-callus');

    $popupCallus.find('.custom-popup__close-btn').on('click', function (e) {
        e.preventDefault();
        $popupCallus.euv_custom_popup('close');
    });

    $popupCallus.euv_custom_popup();

    $('.header__callback-btn').on('click', function (e) {
        e.preventDefault();
        $popupCallus.euv_custom_popup('open');
    });


    // --------------------------------
    // Всплывашка с назначением встречи
    // --------------------------------
    let $popupSchedule = $('.popup-schedule');
    if ($popupSchedule.length) {
        $popupSchedule.find('.custom-popup__close-btn').on('click', function (e) {
            e.preventDefault();
            $popupSchedule.euv_custom_popup('close');
        });

        $popupSchedule.euv_custom_popup();

        $('.call-popup-schedule').on('click', function (e) {
            e.preventDefault();
            $popupSchedule.euv_custom_popup('open');
        });

        let currentDate = new Date(new Date().getTime());
        let hours = currentDate.getHours();
        let endTime = new Date(currentDate);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setHours(58);

        $.datetimepicker.setLocale('ru');
        $('.datetime').datetimepicker({
            minTime: '00:00',
            minDate: endTime
        });
    }


    // --------------------------------
    // Всплывашка с сообщением. Нужна на случай, если на странице есть форма без всплывашки - чтобы уведомить об успешной или неудачной отправке.
    // --------------------------------
    let $popupMessage = $('.popup-message');
    if ($popupMessage.length) {
    }
    $popupMessage.find('.custom-popup__close-btn').on('click', function (e) {
        e.preventDefault();
        $popupMessage.euv_custom_popup('close');
    });
    $popupMessage.euv_custom_popup();


    // --------------------------------
    // Делаем ширину для iframe в столбиках 100%, а высоту пропорционально
    // --------------------------------
    $('.return__column iframe').wrap('<div class="iframe-wrap">');


    // --------------------------------
    // lightcase
    // --------------------------------
    $('a[data-rel^=lightcase], .link-zoom-img').lightcase();


    // --------------------------------
    // Клик по бургеру
    // --------------------------------
    $('.nav-toggle-wrap').on('click', function () {
        var $topMenu = $('.header__menu');
        $(this).add($topMenu).toggleClass('open');
        $topMenu.slideToggle({
            duration: 200
        });
    });


    // --------------------------------
    // Действия при скролле
    // --------------------------------
    $(window).scroll(function () {
        // --------------------------------
        // Фиксирование шапки при скролле
        // --------------------------------
        var $wrapper = $('.wrapper');
        var $sectTop = $('.sect-top');
        var cls = 'fixed-header';
        var $header = $('.header');
        var $headerInner = $('.header__inner');
        var windowScrollTop = $(window).scrollTop();

        var value1 = $headerInner.height();
        // parseFloat - чтобы убрать "px" с конца
        value1 += parseFloat($headerInner.css('padding-top'));

        if (windowScrollTop <= value1) {
            $wrapper.removeClass(cls);
            $sectTop.css('padding-top', '');
        } else {
            if (!$wrapper.hasClass(cls)) {
                $sectTop.css('padding-top', $header.outerHeight(true));
                $wrapper.addClass(cls);
            }
        }

    }).trigger('scroll');


    // --------------------------------
    // Действия с событием resize
    // --------------------------------
    let lastInnerWidth = window.innerWidth;

    $(window).resize(function () {
        // --------------------------------
        // Убираем стили и классы у меню, оно переключилось с мобильного на компьютерное и наоборот
        // --------------------------------
        if ((window.innerWidth > 768 && lastInnerWidth <= 768) || (lastInnerWidth > 768 && window.innerWidth <= 768)) {
            // Сворачиваем меню
            $('.header__menu').removeAttr('style').removeClass('open');
            // Превращаем крестик в бургере. Переворачиваем стрелочку у пункта меню
            $('.nav-toggle-wrap, .header__menu-item_with-submenu').removeClass('open');
            // Сворачиваем подменю
            $('.header__submenu').css('display', '');
        }

        /*
        // --------------------------------
        // ...
        // --------------------------------
        switch (true) {
            case (window.innerWidth > 768):
                break;
            case (window.innerWidth <= 768):
                break;
        }

        // --------------------------------
        // Скрипты главной
        // --------------------------------
        if ($('.page-main').length) {
        }
        */
        lastInnerWidth = window.innerWidth;
    }).resize();
});
