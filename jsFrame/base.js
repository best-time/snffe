(function (win, cb) {
    
})(this || window, function () {
        
    'use strict'
        
    function _(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
    }
    var __ = _.prototype
        
    _.now = Date.now || function () {
        return +new Date() || new Date() - 0 || new Date().getTime();
    };

    requestAnimationFrame = function (callback) {
        if (requestAnimationFrame) return requestAnimationFrame(callback);
        else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
        else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
        else return setTimeout(callback, 1000 / 60);
            
    };
    cancelAnimationFrame = function (id) {
        if (cancelAnimationFrame) return cancelAnimationFrame(id);
        else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
        else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
        else return clearTimeout(id);
            
    };


    // 水波效果
    $(function () {
        $(".ripple").click(function (e) {
            if ($(this).find("#wave").length) $(this).find("#wave").remove();
    
            $(this).append("<div id='wave'></div>");
            var wave = $(this).find("#wave");
            wave.css({
                "display": " block",
                //涟漪的颜色
                "background": " rgba(0, 0, 0, 0.3)",
                "border-radius": " 50%",
                "position": " absolute",
                "-webkit-transform": " scale(0)",
                "transform": " scale(0)",
                "opacity": " 1",
                //涟漪的速度
                "-webkit-transition": " all 0.7s",
                "transition": " all 0.7s",
                "z-index": " 1",
                "overflow": " hidden",
                "pointer-events": " none"
            });
            // 获取ripple的宽度和高度
            waveWidth = parseInt($(this).outerWidth());
            waveHeight = parseInt($(this).outerHeight());

            if (waveWidth < waveHeight) {
                var R = waveHeight;
            } else {
                var R = waveWidth;
            }
            wave.css({
                "width": (R * 2) + "px",
                "height": (R * 2) + "px",
                "top": (e.pageY - $(this).offset().top - R) + 'px',
                "left": (e.pageX - $(this).offset().left - R) + 'px',
                "transform": "scale(1)",
                "-webkit-transform": "scale(1)",
                "opacity": "0"
            });
        });
    });

    // 刷新页面的几种方法
    function reload() {
        history.go(0)
        location.reload()
        location = location
        location.assign(location)
        document.execCommand('Refresh')
        window.navigate(location)
        location.replace(location)
        document.URL = location.href
    }



    function nameSpace(str, obj) {
        var parts = str.split('.'),
            item,
            container = window

        while (parts.length > 0) {
            item = parts.shift()
            if (parts.length === 0) {
                container[item] = obj || container[item] || {}
                return container[item]
            } else {
                container[item] = container[item] || {}
            }
            container = container[item]
        }
        return obj
    }



    var fnJsLoad = function (url, callback) {
        callback = callback || function () { };

        var eleScript = document.createElement('script');
    
        eleScript.onload = function () {
            if (!eleScript.isInited) {
                eleScript.isInited = true;
                callback();
            }
        };
        // 一般而言，低版本IE走这个
        eleScript.onreadystatechange = function () {
            if (!eleScript.isInited && /^loaded|complete$/.test(eleScript.readyState)) {
                eleScript.isInited = true;
                callback();
            }
        };

        eleScript.src = url;

        doc.getElementsByTagName('head')[0].appendChild(eleScript);
    };

    /*
        // IE10+加载zepto.js
    // IE7-IE9加载jQuery
    var URLLIB = '/js/zepto.min.js';
    
    if (!history.pushState) {
        URLLIB = '/js/jquery.min.js';
    }
    
    fnJsLoad(URLLIB, function() {
        // 业务脚本初始化
        init();
    });
     */


    return {
            
    }
});

    window.DEBUG = true
!function (win, doc, undefined) {

    function log(info) {
        
    }
    var cc  =  {
        echo : function (type, pre, mid, suf) {
            console[type](
                "%c " + (pre[0] ? pre[0] + ' ' : '') +
                "%c " + (mid[0] ? mid[0] + ' ' : '') +
                "%c " + (suf[0] ? suf[0] + ' ' : ''), 
                "color: #ffffff; background:" + pre[1],
                "color: #ffffff; background:" + mid[1],
                "color: #ffffff; background:" + (suf[0] ? suf[1] : mid[1])
            )
        },
        log : function (message, title, description) {
            this.echo('log', [title, '#999'], [message, '#333'], [description, '#666'])
        },
        info : function (message, title, description) {
            this.echo('info', [title, '#0cf'], [message, '#06c'], [description, '#0c0'])
        },
        warn : function (message, title, description) {
            this.echo('warn', [title, '#f60'], [message, '#f30'], [description, '#f90'])
        },
        error : function (message, title, description) {
            this.echo('warn', [title, '#f06'], [message, '#903'], [description, '#993'])
        },
        dir : function (message) {
            console.dir.apply(console, message)
        }
    }
        
    function pubSub() {
        var chanels = {}

        function pub() {
            var args = arguments, subs = chanels[args[0]]

            if (!subs) return
            
            var len = subs.length,
                params = args.length > 1 ? Array.prototype.slice.call(args, 1) : []
                
            setTimeout(function () {
                for (var i = 0; i < len; i++) {
                    subs[i].apply(null, params)
                }
                
            }, 0)
            
        }

        function sub(name, cb) {
            if (typeof name !== 'string') throw ('string needed')
            if (typeof cb !== 'function') throw ('function needed')
            
            if (!chanels[name]) chanels[name] = []
            
            chanels[name][chanels[name].length] = cb
            return {name: name, cb: cb}
            
        }

        function unsub(subReturn) {
            var name = subReturn.name
            if (chanels[name]) {
                delete chanels[name]
            }
            
        }
cc.log({name: 1})
        return {
            sub: sub,
            pub: pub,
            unsub: unsub,
            chanels: chanels
        }
    }

    window.pubSub = pubSub()
        
    }(window, document)