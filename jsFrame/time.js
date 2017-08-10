/**
 * time.js
 * 
 * setTimeout / setInterval
 */

!function (root, undefined) { 

    var toStr = Object.prototype.toString    

    function isString (v) {
        return toStr.call(v) === '[object String]'
    }    
    function isBoolean(v) {
        return toStr.call(v) === '[object Boolean]'
    }
    
    var ids = {}
    window.ids = ids
    
    root.wait = function (time, cb, id) {
        var timeout = 0
        timeout = setTimeout(cb, time)
        if (id && isString(id)) ids[id] = timeout
        return timeout
    }    

    root.repeat = function (time, cb, id, callBefore) {
        var interval = 0

        if (arguments.length === 3) {
            if (isBoolean(id)) {
                callBefore = id
            }
        }

        if (callBefore) cb()

        interval = setInterval(cb, time)
        if (id && isString(id)) ids[id] = interval
        return interval
    }

    root.until = function (condition, cb, time, id) {
        if (condition()) {
            cb()
            return
        }

        var interval = root.repeat(time, function () {
            if (condition()) {
                root.clear(interval)
                cb()
            }
        }, id, false)        

    }
    
    var _clear = function (id) {
        clearTimeout(id)
        clearInterval(id)
    }

    root.clear = function (id) {
        if (arguments.length === 0) {
            for (id in ids) {
                _clear(ids[id])
                delete ids[id]
            }
        } else {
            _clear(id)
        }
    }
    
}(this)