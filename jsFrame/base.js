(function (win, cb) {
    
    class a {
        constructor(age) {
            this.age  = age
        }
    }

    win.eve = Object.create(cb())
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

    let requestAnimationFrame = function (callback) {
        if (requestAnimationFrame) return requestAnimationFrame(callback);
        else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
        else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
        else return setTimeout(callback, 1000 / 60);
            
    };
    let cancelAnimationFrame = function (id) {
        if (cancelAnimationFrame) return cancelAnimationFrame(id);
        else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
        else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
        else return clearTimeout(id);
            
    };


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
    
    function extend(dest, obj) {
        // if (!isType(obj, 'Object') || !isType(dest, 'Object')) return
        var keys = Object.keys(obj), len = keys.length, i = len, tmp
        while (--i >= 0) {
            tmp = keys[i]
            if (typeof obj[tmp] === 'object') { // [] / {}
                if (!dest[tmp]) {
                    dest[tmp] = isType(obj[tmp], 'Array') ? [] : {}
                }
                extend(dest[tmp], obj[tmp])
            } else {
                dest[tmp] = obj[tmp]
            }
        }
        return dest
    }    

    function isType(o, type) {
        return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']'
    }    
  
    function loadScript(url, callback = function () { }) {
        var s, h, r = false
        s = document.createElement('script')
        s.type = 'text/javascript'
        s.src = url
        s.onload = s.onreadystatechange = function () {
            if (!r && ( !this.readyState || this.readyState == 'complete')) {
                r = true
                callback()
            }
        }
        h = document.getElementsByTagName('head')[0]
        h.appendChild(s)
    }
    
    function delay(func, millisecond, start) {
        var list = [], millisecond = millisecond || 0
        function add(func, millisecond, start) {
            list.push({
                func: func,
                getTime: function () {
                    var cur = +new Date()
                    start = start || cur
                    return millisecond + (start - cur)
                }
            })
        }
        function exec() {
            var fir = list.shift()
            if (fir) {
                var millisecond = fir.getTime()
                millisecond = millisecond < 0 ? 0 : millisecond
                setTimeout(function () {
                    fir.func();
                    exec();
                }, millisecond)
            }
        }
        add(func, millisecond, start)
        exec()
    }    
        
     class log {
         constructor() {
             this.log = this.log.bind(this) 
         }
         echo(type, pre, mid, suf) {
            console[type](
                "%c " + (pre[0] ? pre[0] + ' ' : '') + "%c " + (mid[0] ? mid[0] + ' ' : '') + "%c " + (suf[0] ? suf[0] + ' ' : ''),
                "color: #ffffff; background:" + pre[1],
                "color: #ffffff; background:" + mid[1],
                "color: #ffffff; background:" + (suf[0] ? suf[1] : mid[1])
            )
        }
         log(message, title, description) {
            this.echo('log', [title, '#999'], [message, '#333'], [description, '#666'])
        }
        info (message, title, description) {
            this.echo('info', [title, '#0cf'], [message, '#06c'], [description, '#0c0'])
        }
        warn (message, title, description) {
            this.echo('warn', [title, '#f60'], [message, '#f30'], [description, '#f90'])
        }
        error (message, title, description) {
            this.echo('warn', [title, '#f06'], [message, '#903'], [description, '#993'])
        }
        dir(message) {
            console.dir.apply(console, message)
        }
         
     }
        
     var logg = new log() 
     
    return {
        nameSpace: nameSpace,
        extend: extend,
        loadScript: loadScript,
        delay: delay,
        print: logg
    }
});

//=============================== pubsub ========================================

    window.DEBUG = true
!function (win, doc, undefined) {

        
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
            return { name: name, cb: cb }
            
        }

        function unsub(subReturn) {
            var name = subReturn.name
            if (chanels[name]) {
                delete chanels[name]
            }
            
        }

        return {
            sub: sub,
            pub: pub,
            unsub: unsub,
            chanels: chanels
        }
    }

    win.pubSub = pubSub();
        
}(window, document);
    

function wave() {

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
}

// =================================== tool ================================

!function () { 
    
    /**
     * 数组去重
     *
     * 1.遍历数组，一一比较，比较到相同的就删除后面的
     * 2.遍历数组，一一比较，比较到相同的，跳过前面重复的，不相同的放入新数组
     * 3.任取一个数组元素放入新数组，遍历剩下的数组元素任取一个，与新数组的元素一一比较，如果有不同的，放入新数组。
     * 4.遍历数组，取一个元素，作为对象的属性，判断属性是否存在
     * 
     * @param {any} arr 
     * @returns 
     */

    function ov1(arr){
        //var a1=((new Date).getTime())
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    arr.splice(j, 1); j--;
                }  
            }
        }
                      
        //console.info((new Date).getTime()-a1)                
        return arr.sort(function(a,b){return a-b});
    }

    function ov2(a) {
        //var a1=((new Date).getTime())
        var b = [], n = a.length, i, j;
        for (i = 0; i < n; i++) {
            for (j = i + 1; j < n; j++)
                if (a[i] === a[j]){j=false;break;}
            if(j)b.push(a[i]);
            }
        //console.info((new Date).getTime()-a1)    
        return b.sort(function(a,b){return a-b});
    }

    function ov3(a) {
        //var a1=((new Date).getTime())
        var b = [], n = a.length, i, j;
        for (i = 0; i < n; i++) {
            for (j = i + 1; j < n; j++)
            if (a[i] === a[j])j=++i
        b.push(a[i]);}
        //console.info((new Date).getTime()-a1)    
        return b.sort(function(a,b){return a-b});
    }

    function ov4(ar){
        //var a1=((new Date).getTime())
            var m=[],f;
            for(var i=0;i<ar.length;i++){
            f=true; 
            for(var j=0;j<m.length;j++)
            if(ar[i]===m[j]){f=false;break;};
            if(f)m.push(ar[i])}
        //console.info((new Date).getTime()-a1)    
            return m.sort(function(a,b){return a-b});
    }
    
    function ov5(ar){
        //    var a1=(new Date).getTime()
                var m,n=[],o= {};
                for (var i=0;(m= ar[i])!==undefined;i++)
                if (!o[m]){n.push(m);o[m]=true;}
        //    console.info((new Date).getTime()-a1)    
            return n.sort(function(a,b){return a-b});;
    }
    

}(window, document)