/**
 * 浏览器特性检测
 * author: ywy
 */

;(function (win, doc, undefined) {
    "use strict"

    var docEl = doc.documentElement,
        utils = {
            create: function (el) {
                return doc.createElement(el)
            },
            pfx: (function () { 
                var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
                    styles = doc.createElement('suning').style,
                    memory = {}
                return function (property) {
                    if (typeof memory[property] === 'undefined') {
                        var prop = property.charAt(0).toUpperCase() + property.slice(1),
                            props = (property + ' ' + prefixes.join(prop + ' ')+ prop).split(' ')
                        for (var i in props) {
                            if (styles[props[i]] !== undefined) {
                                memory[property] = props[i]
                                break
                            }
                        }
                    }
                    return memory[property]
                }
            })()
        }
    
    var Feature = {
        css3DTransform: (function () {
            return !!utils.pfx('perspective')
        } ()),
        
        cssTransform: (function () {
            return !!utils.pfx('transformOrigin')
        } ()),
        cssTransition: (function () {
            return !!utils.pfx('transition')
        } ()),
        
        addEventListener: !!window.addEventListener,

        querySelectorAll: !!doc.querySelectorAll,

        classList: !!('classList' in docEl),

        placeholder: !!('placeholder' in utils.create('input')),

        localStorage: (function () {
            var x = 'x'
            try {
                win.localStorage.setItem(x, x)
                win.localStorage.setItem('y', x)
                win.localStorage.removeItem('y')
                return win.localStorage.getItem(x) === 'x' // 魅族低版本手机存在对应api,但不能真实存取数据
            } catch (e) {
                console.log(e.message)
                return false
            }
        })(),

        historyAPI: win.history && ('pushState' in win.history),
        
        canvas: (function (el) {
            return !!(el.getContext && el.getContext('2d'))
        })(utils.create('canvas')),

        svg: !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,

        webGL : (function(el) {
            try {
                return !!(win.WebGLRenderingContext &&
                            (el.getContext("webgl") || el.getContext("experimental-webgl")));
            } catch(err) {
                return false;
            }
        })(utils.create("canvas")),

        geolocation: !!('geolocation' in win.navigator)
    }
    
    win.feature = Feature

})(window, document);