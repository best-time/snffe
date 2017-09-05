function Register() {
  this.routes = [];
}
var rp = Register.prototype;

// 注册 settter getter 回调 cb
rp.regist = function(obj, k, fn) {
  /**
 *  数组实例的find方法，用于找出 (第一个) 符合条件的数组成员。它的参数是一个回调函数，
 * 所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后 (返回该成员)。
 * 如果没有符合条件的成员，则返回undefined。
 */
  var route = this.routes.find(function(el) {
    var result;
    if (
      (el.key === k || el.key.toString() === k.toString()) &&
      Object.is(el.obj, obj) // 两值是否相等
    ) {
      result = el;
    }
    return result;
  });

  if (route) {
    route.fn.push(fn);
  } else {
    this.routes.push({
      obj,
      key: k,
      fn: [fn]
    });
  }
};
rp.build = function() {
  this.routes.forEach(function(route) {
    observer(route.obj, route.key, route.fn);
  });
};

function observer(obj, k, callback) {
  if (!obj || (!k && k !== 0))
    throw new Error("Please pass an object to the observer.");

  if (Object.prototype.toString.call(k) === "[object Array]") {
    observePath(obj, k, callback);
  } else {
    let old = obj[k];
    if (!old) throw new Error("The key to observe is undefined.");

    if (Object.prototype.toString.call(old) === "[object Array]") {
      observeArray(old, callback);

      // } else if (old.toString() === '[object Object]') {
    } else if (Object.prototype.toString.call(old) === "[object Object]") {
      observeAllKey(old, callback);
    } else {
      Object.defineProperty(obj, k, {
        enumerable: true,
        configurable: true,
        get: function() {
          return old;
        },
        set: function(now) {
          if (now !== old) {
            callback.forEach(fn => {
              fn(old, now);
            });
          }
          old = now;
        }
      });
    }
  }
}

function observePath(obj, paths, callback) {
  var nowPath = obj;
  var key;

  paths.forEach(function(path, index) {
    var path2Num = parseInt(path, 10);
    let pathArr = path;
    if (path2Num === pathArr) {
      pathArr = path2Num;
    }
    if (index < paths.length - 1) {
      nowPath = nowPath[pathArr];
    } else {
      key = pathArr;
    }
  });

  observer(nowPath, key, callback);
}

function observeArray(arr, callback) {
  var arrayProto = Array.prototype;
  var hackProto = Object.create(Array.prototype);

  var oam = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
  oam.forEach(function(method) {
    Object.defineProperty(hackProto, method, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function operateArray(...arg) {
        const old = arr.slice();
        const now = arrayProto[method].call(this, ...arg);
        callback.forEach(function(fn) {
          fn(old, this, ...arg);
        });
        return now;
      }
    });
  });

  Object.setPrototypeOf(arr, hackProto);
}

function observeAllKey(obj, callback) {
  var keys = Object.keys(obj);
  keys.forEach(function(key) {
    observer(obj, key, callback);
  });
}

// ==================================================================

function Latte(latte) {
  if (!latte.el || !latte.data)
    throw new Error("Latte need an object to observe.");

  this.$data = latte.data;
  this.$register = new Register();

  this.$el = document.querySelector(latte.el);

  this.$eventList = latte.eventList;  // parseEvent 使用

  this.$frag = this.node2Fragment(this.$el); // 文档碎片
  this.scan(this.$frag); // 解析 event / class / model

  this.$el.appendChild(this.$frag);

  this.$register.build(); // 添加 observe
}

var lp = Latte.prototype;

lp.scan = function(node) {
  var _this = this;

  // 是根元素 或 不包含 lait-list 属性
  if (node === _this.$frag || !node.getAttribute("lait-list")) {

    var childs = [];
    if (node.children) {
      // childs = [...node.children];
      childs = [].slice.call(node.children);
    } else {
      var tmp = [].slice.call(node.childNodes)
      // [...node.childNodes].forEach(function(child) {
        tmp.forEach(function(child) {
        if (child.nodeType === 1) {
          childs.push(child);
        }
      });
    }

    childs.forEach(function(child) {
      if (node.path) { // 父元素path 赋值给 子元素
        child.path = node.path;
      }
      _this.parseEvent(child);
      _this.parseClass(child);
      _this.parseModel(child);
      if (child.children.length) {
        // 当前元素是否 还有子元素
        _this.scan(child);
      }
    });

  } else {

    _this.parseList(node);

  }
};

lp.node2Fragment = function(el) {
  var fragment = document.createDocumentFragment();
  var child = el.firstChild;
  while (child) {
    fragment.appendChild(child);
    child = el.firstChild;
  }
  return fragment;
};

lp.parseData = function(str, node) {
  var _this = this;
  var list = str.split(":");

  var data;
  var nowPath;

  var arrayCounter = 1;
  var path = [];

  list.forEach(function(key, index) {
    if (index === 0) {  // 第一个属性
      data = _this.$data[key];

    } else if (node.path) {
      
      nowPath = node.path[arrayCounter];
      arrayCounter += 1;

      if (nowPath === key) {
        data = data[key];
      } else {
        path.push(nowPath);
        data = data[nowPath][key];
        arrayCounter += 1;
      }

    } else {
      data = data[key];
    }

    path.push(key);

  });

  if (node.path && node.path.length > path.length) {
    var lastPath = node.path[node.path.length - 1];
    //if (typeof lastPath === 'number') {//}
    data = data[lastPath];
    path.push(lastPath);
    
  }
  //if (!node.path || node.path !== path) {//}
  node.path = path;
  
  return { path, data };
};

lp.parseEvent = function(node) {

  if (node.getAttribute("lait-event")) {

    var eventName = node.getAttribute("lait-event");
    var type = this.$eventList[eventName].type;
    var fn = this.$eventList[eventName].fn.bind(node);

    if (type === "input") {

      var cmp = false;
      node.addEventListener("compositionstart", function() {
        cmp = true;
      });
      node.addEventListener("compositionend", function() {
        cmp = false;
        node.dispatchEvent(new Event("input"));
      });
      node.addEventListener("input", function input() {
        if (!cmp) {
          var start = this.selectionStart;
          var end = this.selectionEnd;
          fn();
          this.setSelectionRange(start, end);
        }
      });

    } else {
      node.addEventListener(type, fn);
    }

  }
};

lp.parseClass = function(node) {

  if (node.getAttribute("lait-class")) {

    var className = node.getAttribute("lait-class");
    var dataObj = this.parseData(className, node);

    if (!node.classList.contains(dataObj.data)) {
      node.classList.add(dataObj.data);
    }

    this.$register.regist(this.$data, dataObj.path, function(old, now) {
      node.classList.remove(old);
      node.classList.add(now);
    });

  }
};

lp.parseModel = function(node) {

  if (node.getAttribute("lait-model")) {

    var modelName = node.getAttribute("lait-model");
    var dataObj = this.parseData(modelName, node);

    if (node.tagName === "INPUT") {
      node.value = dataObj.data;
    } else {
      node.innerText = dataObj.data;
    }

    this.$register.regist(this.$data, dataObj.path, function(old, now) {
      if (node.tagName === "INPUT") {
        node.value = now;
      } else {
        node.innerText = now;
      }
    });
    
  }
};

lp.parseList = function(node) {
  var _this = this;

  var parsedItem = this.parseListItem(node);
  var itemEl = parsedItem.itemEl;
  var parentEl = parsedItem.parentEl;

  var list = node.getAttribute("lait-list");
  var listData = this.parseData(list, node);
  
  //用数据循环 元素标签
  listData.data.forEach(function(_dataItem, index) {
    const copyItem = itemEl.cloneNode(true);
    // copyItem.$data = _dataItem;
    //if (node.path) {
    copyItem.path = node.path.slice();   // '父元素' path  赋给 '子元素'
    //}
    copyItem.path.push(index);
    
    _this.parseEvent(copyItem);
    _this.parseClass(copyItem);
    _this.parseModel(copyItem);

    _this.scan(copyItem);
    parentEl.insertBefore(copyItem, itemEl);
  });


  parentEl.removeChild(itemEl);
  this.$register.regist(this.$data, listData.path, function() {
    while (parentEl.firstChild) {
      parentEl.removeChild(parentEl.firstChild);
    }

    var thisListData = _this.parseData(list, node);
    parentEl.appendChild(itemEl);
    thisListData.data.forEach(function(_dataItem, index) {
      var copyItem = itemEl.cloneNode(true);
      copyItem.$data = _dataItem;
      if (node.path) {
        copyItem.path = node.path.slice();
      }
      copyItem.path.push(index);
      _this.parseEvent(copyItem);
      _this.parseClass(copyItem);
      _this.parseModel(copyItem);
      _this.scan(copyItem);
      parentEl.insertBefore(copyItem, itemEl);
    });
    parentEl.removeChild(itemEl);
  });
};

lp.parseListItem = function(node) {
  var _this = this;
  var target;

  getItem(node);
  function getItem(nodeToScan) {
    // var tmp = [...nodeToScan.children];

    var tmp = [].slice.call(nodeToScan.children)
    tmp.forEach(function(thisNode) {
      if (nodeToScan.path) {
        thisNode.path = nodeToScan.path.slice();
      }
      if (thisNode.getAttribute("lait-list-item")) {
        target = {
          itemEl: thisNode, // 子元素
          parentEl: nodeToScan // 父元素
        };
      } else {
        _this.parseEvent(thisNode);
        _this.parseClass(thisNode);
        _this.parseModel(thisNode);
        getItem(thisNode);
      }
    });
  }

  return target;
};

/**
     *
     *
     *
     *
     *
     *
     * //input 事件兼容处理以及中文输入法优化
     
  compositionstart
当浏览器有非直接的文字输入时, compositionstart事件会以同步模式触发.

compositionend
当浏览器是直接的文字输入时, compositionend会以同步模式触发.
看了两个事件就明白，为元素添加这个两个事件，做一个开关，如下: html:

<input type="text" id="person" />
js:


var node = document.querySelector('#person');
var cpLock = false;
node.addEventListener('compositionstart', function(){
    cpLock = true;
})
node.addEventListener('compositionend', function(){
    cpLock = false;
})
node.addEventListener('input', function(){
    if(!cpLock)console.log(this.value);
});

     */
