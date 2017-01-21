;
!function (context, factory) {
    if (context.store) {

    }
    context.store = factory();
}(this, function () {

    var win = (typeof window != 'undefined' ? window : global),
        doc = win.document,
        localStorageName = "localStorage",
        sessionStorageName = "sessionStorage"
        ;

    //属性继承
    var extend = function (parent, child) {
        var p;
        for (p in parent) {
            if (!child.hasOwnProperty(p)) { //  如果子对象存在目标对象的属性,则保留子对象上的原属性
                child[p] = parent[p]
            }
        }
        return child;
    }

    //转成对象字符串
    var stringify = function (res) {
        return res === undefined ||
        typeof res === "function"
            ? res + "" : JSON.stringify(res);
    }

    //对象字符串格式化成对象
    var parse = function (res) {
        try {
            return JSON.parse(res)
        } catch (e) {
            return res
        }
    }

    var storeAPI = {
        set: function (key, value) {
            win[localStorageName].setItem(key, stringify(value));
        },
        get: function (key) {
            return parse(win[localStorageName].getItem(key));
        },
        remove: function (key) {
            win[localStorageName].removeItem(key);
        },
        clear: function () {
            win[localStorageName].clear();
        },
        size: function() {
            return win[localStorageName].length;
        },
        keys: function () {
            var keysArr = [],
                p
                ;
            for (p in win[localStorageName]) {
                keysArr.push(p)
            }
            return keysArr;
        },
        getAll: function () {
            var all = {},
                keys = this.keys(),
                i = -1
                ;
            while(++i < this.size()) {
                all[keys[i]] = win[localStorageName][keys[i]]
            }
            return all;
        }
    };

    function Store() {
        if (!this instanceof Store) {
            return new Store();
        }
        var store = extend(storeAPI, function(key, data) {
            if (arguments.length === 0) {
                return store.getAll();
            }
            if (data !== undefined) {
                return store.set(key, data);
            }
            if (typeof key === "string" || typeof key === "number") {
                return store.get(key);
            }
            if (!key) {
                return store.clear();
            }
            //return store.setAll(key, data);// overwrite=data, data=key
        });

        return store
    }

    return Store();
});