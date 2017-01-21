/**
 * author: 16040500
 */
; (function ($, win, doc) {
    'use strict'

    var db = doc.body,
        emptyObj = {},
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype
    
    function createObject() {
        return Object.create(null)
    }
    // $.isPlainObject( Object.create(null) ) 为 false
    function isObject(obj) {
        return emptyObj.toString.call(obj) === '[object Object]'
    }
    function isArray(arr) {
        return emptyObj.toString.call(arr) === '[object Array]'
    }
    function hasItem(arr, item) {
        if (!isArray(arr)) return
        var len = arr.length, i = len
        while (--i > -1) {
            if (item === arr[i]) {
                return i
            }
        }
        return -1
    }

    function _dealCssEvent(eventNameArr, cb) {
        if (!isArray(eventNameArr)) return

        var events = eventNameArr,
            len = events.length,
            i = -1,
            j = -1,
            dom = this
        
        function fireCallBack(e) {
            if (e.target !== this) return;
            cb.call(this, e);
            while (++i < len) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (cb) {
            while (++j < len) {
                dom.on(events[j], fireCallBack)
            }
        }
    }

    $.fn.animationEnd = function(cb) {
        _dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], cb);
        return this;
    };
    $.fn.transitionEnd = function(cb) {
        _dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], cb);
        return this;
    };

    var _slide = createObject(),
        count = 0
    
        _slide.tempArr = []
    var slideBottomCss = '<style>._popup_{position:absolute}._popup-bottom_{bottom:0;left:0;right:0;width:100%;z-index:10010;background:#fff;-webkit-transition:all 0.4s;transition:all 0.4s}._popup-bottom_.slide-out{-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}._popup-bottom_.slide-in{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}._popup-left_{bottom:0;left:0;height:100%;z-index:10010;background:#fff;-webkit-transition:all 0.4s;transition:all 0.4s}._popup-left_.slide-out{-webkit-transform:translate3d(-100%, 0, 0);transform:translate3d(-100%, 0, 0)}._popup-left_.slide-in{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}.popup-overlay{position:absolute;top:0;left:0;right:0;bottom:0;z-index:10000;opacity:0;visibility:hidden;background:rgba(0,0,0,0.4);-webkit-transition:all 0.4s;transition:all 0.4s}.popup-overlay.modal-overlay-visible{opacity:1;visibility:visible}</style>'
    
    _slide.modal = function (params) {
        if (!isObject(params)) {
            console.error('modal参数为对象')
            return
        }
        if (!!!params.name) return
        
        var slideInCb = params.slideInCb || false,
            slideOutCb = params.slideOutCb || false,
            hasCss = _slide.tempArr.length ? true : false,
            positionClass = params.position === 'left' ? '_popup-left_' : '_popup-bottom_',
            maskString = '<div class="popup-overlay close-popup"></div>',
            hasName = hasItem(_slide.tempArr, params.name) < 0

        if (hasName) {
            _slide.tempArr[_slide.tempArr.length] = params.name
            var htmlTemp = '<div class="_popup_ '+ positionClass +' slide-out" id="_popup-' + params.name + '_">' + params.htmlTemp + '</div>'
            $(db).append((hasCss ? '' : slideBottomCss) + htmlTemp)
            $('.popup-overlay').length < 1 && $(db).append(maskString)
        }
        var $popup = $('#_popup-' + params.name + '_'),
            isOut = $popup.hasClass('slide-out')
        if (isOut) {
            $popup.css({
                bottom: -document.body.scrollTop + 'px'
            }).show()
                .removeClass("slide-out")
                .addClass("slide-in")
                .transitionEnd(function () {
                    if ($(this).hasClass('slide-in')) {
                        $(db).on('touchmove', function (e) {
                            e.preventDefault()
                            return false
                        })
                         slideInCb && slideInCb()
                    }
                       
            })
            $('.popup-overlay').addClass('modal-overlay-visible')
        }

        $(doc).off().on('click', '.close-popup', function (e) {
            e.preventDefault()
            $('.popup-overlay').removeClass('modal-overlay-visible')
            $('._popup_')
                .removeClass('slide-in')
                .addClass('slide-out')
                // .off()
                .transitionEnd(function () {
                    if ($(this).hasClass('slide-out')) {
                        $(this).hide()
                        $(db).off('touchmove')
                        slideOutCb && slideOutCb()
                    }
                })
            
        })
        
    }
    

    $.modal = _slide.modal

})($, window, document);