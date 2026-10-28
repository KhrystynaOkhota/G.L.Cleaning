var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    // 1. ПЕРЕВІРКА ПРИСТРОЇВ ТА БРАУЗЕРІВ
    const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchScreen) $('html').addClass('touch-screen');

    const userAgent = navigator.userAgent;
    const is_Mac = (navigator.userAgentData?.platform || navigator.platform).toUpperCase().indexOf('MAC') >= 0;
    const is_IE = /MSIE 9/i.test(userAgent) || /rv:11.0/i.test(userAgent) || /MSIE 10/i.test(userAgent) || /Edge\/\d+/.test(userAgent);
    const is_Chrome = userAgent.indexOf('Chrome') >= 0 && userAgent.indexOf('Edge') < 0;

    winWidth = $(window).width();
    let winHeight = $(window).height();

    if (is_Mac) $('html').addClass('mac');
    if (is_IE) $('html').addClass('ie');
    if (is_Chrome) $('html').addClass('chrome');

    // 2. МОДАЛЬНІ ВІКНА (POPUP)
    let popupTop = 0;

    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();
        $('html').css({ "position": "fixed", "top": -popupTop, "width": "100%" });
    };

    _functions.addScroll = function () {
        $('html').css({ "position": "static" });
        window.scroll(0, popupTop);
    };

    _functions.openPopup = function (popup) {
        $('.popup-content').removeClass('active');
        $(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {
        $('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .btn--close, .popup-wrapper .layer-close', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });

    // 3. СКРОЛ ФУНКЦІЇ ТА АНІМАЦІЇ
    let prev_scroll = 0;

    _functions.scrollCall = function () {
        const winScr = $(window).scrollTop();

        if (winScr > prev_scroll) {
            $("header").addClass("scrolled");
        }
        prev_scroll = winScr;

        if (winScr <= 10) {
            $("header").removeClass("scrolled");
            prev_scroll = 0;
        }

        scrollAnime(winScr);
    };

    function scrollAnime(winScr) {
        const $animationElements = $('.animation').not('.animated');
        if ($animationElements.length) {
            const currentWinWidth = $(window).width();
            const currentWinHeight = $(window).height();

            $animationElements.each(function () {
                const $th = $(this);
                const triggerCoef = currentWinWidth < 768 ? 0.95 : 0.85;

                if (winScr >= $th.offset().top - (currentWinHeight * triggerCoef)) {
                    $th.addClass('animated');
                }
            });
        }
    }

    window.addEventListener('scroll', _functions.scrollCall, { passive: true });
    _functions.scrollCall();
    window.addEventListener('load', _functions.scrollCall);

    // 4. МОБІЛЬНЕ МЕНЮ
    $(document).on('click', '.js-open-menu, .js-close-menu, .h-overlay', function () {
        const $header = $('header');
        const isOpen = !$header.hasClass('open-menu');

        $('html').toggleClass('overflow-menu');
        $header.removeClass('hide');
        $header.toggleClass('open-menu');
        $header.removeClass('open-search');

        $('#mobile-menu').toggleClass('is-open', isOpen);
        $('#menu-overlay').toggleClass('is-open', isOpen);
    });

    $(document).on('click', '.h-menu-overlay', function () {
        $('html').removeClass('overflow-menu');
        $('header').removeClass('open-menu open-search');
        $('.h-search-form input').val("");
        $(".h-search-results").removeClass("is-active");
    });

    // Випадаюче меню та стрілочки
    $('.header .menu-item-has-children, .footer-nav .menu-item-has-children').each(function () {
        var $this = $(this);
        var $link = $this.children('a');

        if (!$this.children('.menu-item__row').length) {
            var $arrow = $link.find('.arrow');
            if ($arrow.length) {
                $arrow.detach();
            } else {
                $arrow = $('<span class="arrow">▼</span>');
            }

            $link.wrap('<div class="menu-item__row"></div>');
            $this.children('.menu-item__row').append('<div class="menu-item__btn"></div>');
            $this.children('.menu-item__row').find('.menu-item__btn').append($arrow);
        }
    });

    $(document).off('click', '.menu-item__btn').on('click', '.menu-item__btn', function (e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            e.stopPropagation();

            var $parentLi = $(this).closest('.menu-item-has-children');
            $parentLi.children('.sub-menu').stop(true, true).slideToggle(300);
            $parentLi.toggleClass('is-active');
        }
    });

    $(window).on('resize', function () {
        if (window.innerWidth >= 992) {
            $('.menu-item-has-children').removeClass('is-active');
            $('.sub-menu').removeAttr('style');
        }
    });

    // 5. ТАБИ (DESKTOP) ТА АКОРДЕОН (MOBILE)
    const $tabBtns = $('.p-tabs__nav-btn');
    const $tabPanels = $('.p-tabs__panel');

    function initTabs() {
        $tabBtns.removeClass('is-active');
        $tabPanels.removeClass('is-active');

        const $firstBtn = $tabBtns.first();
        const $firstPanel = $tabPanels.first();

        $firstBtn.addClass('is-active');
        $firstPanel.addClass('is-active');

        if ($(window).width() < 992) {
            $firstPanel.find('.p-tabs__body').show();
        }
    }

    initTabs();

    $(document).on('click', '.p-tabs__nav-btn', function () {
        const targetId = $(this).data('tab');

        $tabBtns.removeClass('is-active');
        $(this).addClass('is-active');

        $tabPanels.removeClass('is-active').find('.p-tabs__body').removeAttr('style');
        $(`#${targetId}`).addClass('is-active');
    });

    $(document).on('click', '.js-tab-acc-btn', function () {
        const $currentPanel = $(this).closest('.p-tabs__panel');
        const $currentBody = $currentPanel.find('.p-tabs__body');
        const isOpen = $currentPanel.hasClass('is-active');

        $tabPanels.not($currentPanel).removeClass('is-active');
        $('.p-tabs__body').not($currentBody).stop(true, true).slideUp(300);

        if (isOpen) {
            $currentPanel.removeClass('is-active');
            $currentBody.stop(true, true).slideUp(300);
            $tabBtns.removeClass('is-active');
        } else {
            $currentPanel.addClass('is-active');
            $currentBody.stop(true, true).slideDown(300);

            const panelId = $currentPanel.attr('id');
            $tabBtns.removeClass('is-active');
            $tabBtns.filter(`[data-tab="${panelId}"]`).addClass('is-active');
        }
    });

    // 6. СЕЛЕКТИ (SumoSelect)
    _functions.initSelect = function (parent) {
        var $container = parent ? $(parent) : $(document);

        $container.find('.SelectBox select').each(function () {
            var $select = $(this);

            $select.SumoSelect({
                floatWidth: 0,
                nativeOnDevice: [],
                placeholder: ''
            });

            var $box = $select.closest('.SelectBox');
            $box.toggleClass('value', !!$select.val());

            $select.on('sumo:opened', function () {
                $box.addClass('focus');
            });

            $select.on('sumo:closed', function () {
                $box.removeClass('focus');
            });
        });
    };

    _functions.initSelect('body');

    $(document).on('change', '.SelectBox select', function () {
        $(this).closest('.SelectBox').toggleClass('value', !!$(this).val());
    });
});

// ==========================================================================
// НАТИВНИЙ JAVASCRIPT
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. АКОРДЕОНИ
    document.addEventListener('click', function (e) {
        const $title = $(e.target).closest('.accordeon-title');
        if (!$title.length) return;

        const $item = $title.closest('.accordeon-item');
        const $accordeon = $title.closest('.accordeon');
        const isOpen = $item.hasClass('active');

        $accordeon.find('.accordeon-item.active').not($item).removeClass('active').find('.accordeon-title').next().slideUp();
        $item.toggleClass('active', !isOpen);
        $title.next().slideToggle(!isOpen);
    });

    // 2. КЛІКЕР КІЛЬКОСТІ
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quantity-picker__btn');
        if (!btn) return;

        const container = btn.closest('.quantity-picker');
        const input = container.querySelector('.quantity-picker__input');
        if (!input) return;

        const isIncrement = btn.classList.contains('quantity-picker__btn--increment');
        const value = parseInt(input.value, 10) || 0;
        const min = input.dataset.min ? Number(input.dataset.min) : 1;
        const max = input.dataset.max ? Number(input.dataset.max) : Infinity;

        if (isIncrement && value < max) {
            input.value = value + 1;
        } else if (!isIncrement && value > min) {
            input.value = value - 1;
        }

        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // 3. ВІДЕОПЛЕЄР
    jQuery(document).on('click', '.media__btn', function () {
        const $btn = jQuery(this);
        const $container = $btn.closest('.media');
        const $video = $container.find('.media__video');
        const videoItem = $video.get(0);

        if (!videoItem) return;

        if (videoItem.paused) {
            videoItem.play();
            $video.attr('controls', '');
            $btn.addClass('hide');
            $container.find('.heading').hide();
        } else {
            videoItem.pause();
            $video.removeAttr('controls');
            $btn.removeClass('hide');
            $container.find('.heading').show();
        }
    });

    jQuery(document).on('ended', '.media__video', function () {
        const $video = jQuery(this);
        const $container = $video.closest('.media');

        $video.removeAttr('controls');
        $container.find('.media__btn').removeClass('hide');
        $container.find('.heading').show();
    });

    // 4. ТАБИ
    document.addEventListener("click", (e) => {
        const tabItem = e.target.closest(".tab__item");
        if (!tabItem) return;

        const currentTabBlock = tabItem.closest(".tab");
        if (!currentTabBlock) return;

        const tabList = currentTabBlock.querySelector(":scope > .tab__list");
        if (!tabList) return;

        const tabItems = [...tabList.children].filter(child => child.classList.contains("tab__item"));
        const clickedIndex = tabItems.indexOf(tabItem);
        if (clickedIndex === -1) return;

        const tabContent = currentTabBlock.querySelector(":scope > .tab__content");
        if (!tabContent) return;

        const tabPanels = [...tabContent.children].filter(child => child.classList.contains("tab__panel"));

        tabItems.forEach(item => item.classList.remove("is--active"));
        tabPanels.forEach(panel => panel.classList.remove("is--active"));

        tabItem.classList.add("is--active");
        if (tabPanels[clickedIndex]) {
            tabPanels[clickedIndex].classList.add("is--active");
        }
    });

    // 5. ЛІЧИЛЬНИКИ
    if ('IntersectionObserver' in window) {
        const obsCounter = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("animated");

                $(entry.target).find(".stats__value--number").each(function () {
                    $(this).prop("Counter", 0).animate({
                        Counter: $(this).text(),
                    }, {
                        duration: 1500,
                        easing: "swing",
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        },
                    });
                });
                observer.unobserve(entry.target);
            });
        });
        document.querySelectorAll(".stats__grid").forEach(block => obsCounter.observe(block));
    }

    // 6. ФУТЕР-АКОРДЕОН (МОБІЛЬНА ВЕРСІЯ)
    const accordions = document.querySelectorAll('.js-footer-accordion');
    accordions.forEach(accordion => {
        const title = accordion.querySelector('.footer-nav__title');
        if (title) {
            title.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    accordion.classList.toggle('is-open');
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (!header) return;

    const checkScroll = () => {
        // Якщо проскролили більше ніж на 30 пікселів — додаємо клас is-scrolled
        if (window.scrollY > 30) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll);
});