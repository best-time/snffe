 
 // https://zhuanlan.zhihu.com/p/24475845?refer=mirone
 
 // --------------------------------------------------------------

// class Register {
//     constructor() {
//       this.routes = [];
//     }
  
//     regist(obj, k, fn) {
//       const route = this.routes.find((el) => {
//         let result;
//         if (
//             (el.key === k || el.key.toString() === k.toString())
//             && Object.is(el.obj, obj)
//         ) {
//           result = el;
//         }
//         return result;
//       });
        
//       if (route) {
//         route.fn.push(fn);
//       } else {
//         this.routes.push({
//           obj,
//           key: k,
//           fn: [fn],
//         });
//       }
        
//     }
  
//     build() {
//       this.routes.forEach((route) => {
//         observer(route.obj, route.key, route.fn);
//       });
//     }
//   }

/**
 * 
 *
 *  数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，
 * 所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。
 * 如果没有符合条件的成员，则返回undefined。
 */

// function Register() {
//       this.routes = []
// }
// var rp = Register.prototype

// rp.regist = function (obj, k, fn) {
//       var route = this.routes.find(function (el) {
//         var result;
//         if (
//             (el.key === k || el.key.toString() === k.toString())
//             && Object.is(el.obj, obj) // 两值是否相等
//         ) {
//           result = el;
//         }
//         return result;
//       });
    
//     if (route) {
//         route.fn.push(fn);
//       } else {
//         this.routes.push({
//           obj,
//           key: k,
//           fn: [fn],
//         });
//       }
// }
// rp.build = function () {
//     this.routes.forEach(function(route) {
//         observer(route.obj, route.key, route.fn);
//       });
//   }

 // -------------------------------------------------------------- 
  
// class Latte {
      
//     constructor(latte) {
//       if(!latte.el || !latte.data) {
//         throw new Error('Latte need an object to observe.');
//       }
//       this.$data = latte.data;
//       this.$register = new Register();
        
//       this.$el = document.querySelector(latte.el);
//       this.$eventList = latte.eventList;
        
//       this.$frag = Latte.node2Fragment(this.$el);
//       this.scan(this.$frag);
//       this.$el.appendChild(this.$frag);
        
//       this.$register.build();
//     }
  
//     static node2Fragment(el) {
//       const fragment = document.createDocumentFragment();
//       let child = el.firstChild;
//       while (child) {
//         fragment.appendChild(child);
//         child = el.firstChild;
//       }
//       return fragment;
//     }
  
//     scan(node) {
//       if (node === this.$frag || !node.getAttribute('lait-list')) {
//         let childs = [];
//         if(node.children) {
//           childs = [...node.children];
//         } else {
//           [...node.childNodes].forEach((child) => {
//             if(child.nodeType === 1) {
//               childs.push(child);
//             }
//           });
//         }
//         childs.forEach((child) => {
//           if (node.path) {
//             child.path = node.path;
//           }
//           this.parseEvent(child);
//           this.parseClass(child);
//           this.parseModel(child);
//           if (child.children.length) {
//             this.scan(child);
//           }
//         });
//       } else {
//         this.parseList(node);
//       }
//     }
  
//     parseData(str, node) {
//       const list = str.split(':');
//       let data;
//       let nowPath;
//       let arrayCounter = 1;
//       const path = [];
        
//       list.forEach((key, index) => {
//         if (index === 0) {
//           data = this.$data[key];
//         } else if (node.path) {
//           nowPath = node.path[arrayCounter];
//           arrayCounter += 1;
//           if (nowPath === key) {
//             data = data[key];
//           } else {
//             path.push(nowPath);
//             data = data[nowPath][key];
//             arrayCounter += 1;
//           }
//         } else {
//           data = data[key];
//         }
//         path.push(key);
//       });
        
//       if (node.path && node.path.length > path.length) {
//         const lastPath = node.path[node.path.length - 1];
//         //if (typeof lastPath === 'number') {
//           data = data[lastPath];
//           path.push(lastPath);
//         //}
//       }
//       //if (!node.path || node.path !== path) {
//         node.path = path;
//       //}
//       return { path, data };
//     }
  
//     parseEvent(node) {

//       if (node.getAttribute('lait-event')) {
//         const eventName = node.getAttribute('lait-event');
//         const type = this.$eventList[eventName].type;
//         const fn = this.$eventList[eventName].fn.bind(node);
//         if (type === 'input') {

//           let cmp = false;
//           node.addEventListener('compositionstart', () => {
//             cmp = true;
//           });
//           node.addEventListener('compositionend', () => {
//             cmp = false;
//             node.dispatchEvent(new Event('input'));
//           });
//           node.addEventListener('input', function input() {
//             if (!cmp) {
//               const start = this.selectionStart;
//               const end = this.selectionEnd;
//               fn();
//               this.setSelectionRange(start, end);
//             }
//           });
            
//         } else {
//           node.addEventListener(type, fn);
//         }
//       }
        
//     }
  
//     parseClass(node) {
//       if (node.getAttribute('lait-class')) {
//         const className = node.getAttribute('lait-class');
//         const dataObj = this.parseData(className, node);
          
//         if (!node.classList.contains(dataObj.data)) {
//           node.classList.add(dataObj.data);
//         }
          
//         this.$register.regist(this.$data, dataObj.path, (old, now) => {
//           node.classList.remove(old);
//           node.classList.add(now);
//         });
//       }
        
//     }
  
//     parseModel(node) {

//       if (node.getAttribute('lait-model')) {
//         const modelName = node.getAttribute('lait-model');
//         const dataObj = this.parseData(modelName, node);
//         if (node.tagName === 'INPUT') {
//           node.value = dataObj.data;
//         } else {
//           node.innerText = dataObj.data;
//         }
//         this.$register.regist(this.$data, dataObj.path, (old, now) => {
//           if (node.tagName === 'INPUT') {
//             node.value = now;
//           } else {
//             node.innerText = now;
//           }
//         });
//       }
        
//     }
  
//     parseList(node) {
        
//       const parsedItem = this.parseListItem(node);
//       const itemEl = parsedItem.itemEl;
//       const parentEl = parsedItem.parentEl;
//       const list = node.getAttribute('lait-list');
//       const listData = this.parseData(list, node);
//       listData.data.forEach((_dataItem, index) => {
//         const copyItem = itemEl.cloneNode(true);
//         copyItem.$data = _dataItem;
//         //if (node.path) {
//           copyItem.path = node.path.slice();
//         //}
//         copyItem.path.push(index);
//         this.parseEvent(copyItem);
//         this.parseClass(copyItem);
//         this.parseModel(copyItem);
//         this.scan(copyItem);
//         parentEl.insertBefore(copyItem, itemEl);
//       });
        
//       parentEl.removeChild(itemEl);
//       this.$register.regist(this.$data, listData.path, () => {
//         while (parentEl.firstChild) {
//           parentEl.removeChild(parentEl.firstChild);
//         }
//         const thisListData = this.parseData(list, node);
//         parentEl.appendChild(itemEl);
//         thisListData.data.forEach((_dataItem, index) => {
//           const copyItem = itemEl.cloneNode(true);
//           copyItem.$data = _dataItem;
//           if (node.path) {
//             copyItem.path = node.path.slice();
//           }
//           copyItem.path.push(index);
//           this.parseEvent(copyItem);
//           this.parseClass(copyItem);
//           this.parseModel(copyItem);
//           this.scan(copyItem);
//           parentEl.insertBefore(copyItem, itemEl);
//         });
//         parentEl.removeChild(itemEl);
//       });
//     }
  
//     parseListItem(node) {
//       const me = this;
//       let target;
        
//       (function getItem(nodeToScan) {
//         [...nodeToScan.children].forEach((thisNode) => {
//           if (nodeToScan.path) {
//             thisNode.path = nodeToScan.path.slice();
//           }
//           if (thisNode.getAttribute('lait-list-item')) {
//             target = {
//               itemEl: thisNode,
//               parentEl: nodeToScan
//             }
//           } else {
//             me.parseEvent(thisNode);
//             me.parseClass(thisNode);
//             me.parseModel(thisNode);
//             getItem(thisNode);
//           }
//         });
//       }(node));
        
//       return target;
//     }
//   }
  
   // -------------------------------------------------------------- 
  
function Register() {
    this.routes = []
}
var rp = Register.prototype

rp.regist = function (obj, k, fn) {
    var route = this.routes.find(function (el) {
      var result;
      if (
          (el.key === k || el.key.toString() === k.toString())
          && Object.is(el.obj, obj) // 两值是否相等
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
        fn: [fn],
      });
    }
}
rp.build = function () {
  this.routes.forEach(function(route) {
      observer(route.obj, route.key, route.fn);
    });
}

  function observer(obj, k, callback) {
    if (!obj || (!k && k !== 0)) throw new Error('Please pass an object to the observer.');
    
    if (Object.prototype.toString.call(k) === '[object Array]') {

        observePath(obj, k, callback);
        
    } else {

        let old = obj[k];
        if (!old) {
            throw new Error('The key to observe is undefined.');
        }
        if (Object.prototype.toString.call(old) === '[object Array]') {
            observeArray(old, callback);
        } else if (old.toString() === '[object Object]') {
            observeAllKey(old, callback);
        } else {
            Object.defineProperty(obj, k, {
            enumerable: true,
            configurable: true,
            get: function() { return old },
            set: function(now) {
                if (now !== old) {
                callback.forEach((fn) => {
                    fn(old, now);
                });
                }
                old = now;
            },
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
    var oam = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    var arrayProto = Array.prototype;
    var hackProto = Object.create(Array.prototype);
      
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
        },
      });
    });
      
    Object.setPrototypeOf(arr, hackProto);
  }
  
  function observeAllKey(obj, callback) {
      var keys = Object.keys(obj)
    keys.forEach(function(key) {
      observer(obj, key, callback);
    });
  }
  
  
  // ==================================================================

  function Latte(latte) {
    if(!latte.el || !latte.data) throw new Error('Latte need an object to observe.');
      
      this.$data = latte.data;
      this.$register = new Register();
        
      this.$el = document.querySelector(latte.el);
      this.$eventList = latte.eventList;
        
      this.$frag = this.node2Fragment(this.$el);
      this.scan(this.$frag);
      this.$el.appendChild(this.$frag);
        
      this.$register.build();
  }

  var lp = Latte.prototype

  lp.scan = function (node) {
      var _this = this
      if (node === _this.$frag || !node.getAttribute('lait-list')) {
      
      var childs = [];
      if(node.children) {
        childs = [...node.children];
      } else {
        [...node.childNodes].forEach(function(child) {
          if(child.nodeType === 1) {
            childs.push(child);
          }
        });
      }

      childs.forEach(function(child)  {
        if (node.path) {
          child.path = node.path;
        }
        _this.parseEvent(child);
        _this.parseClass(child);
        _this.parseModel(child);
        if (child.children.length) {
            _this.scan(child);
        }
      });

    } else {
        _this.parseList(node);
    }
  }


  lp.node2Fragment = function(el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  }


  lp.parseData = function (str, node) {
      
    var _this = this
    var list = str.split(':');

    var data;
    var nowPath;

    var arrayCounter = 1;
    var path = [];
      
    list.forEach(function (key, index) {
      
      if (index === 0) {
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
      //if (typeof lastPath === 'number') {
        data = data[lastPath];
        path.push(lastPath);
      //}
    }
    //if (!node.path || node.path !== path) {
      node.path = path;
    //}
    return { path, data };
  }



  lp.parseEvent = function(node) {
    
      if (node.getAttribute('lait-event')) {
        var eventName = node.getAttribute('lait-event');
        var type = this.$eventList[eventName].type;
        var fn = this.$eventList[eventName].fn.bind(node);
        if (type === 'input') {

          var cmp = false;
          node.addEventListener('compositionstart', function(){
            cmp = true;
          });
          node.addEventListener('compositionend', function() {
            cmp = false;
            node.dispatchEvent(new Event('input'));
          });
          node.addEventListener('input', function input() {
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
            
  }
        
  lp.parseClass = function(node) {
    if (node.getAttribute('lait-class')) {
      var className = node.getAttribute('lait-class');
      var dataObj = this.parseData(className, node);
        
      if (!node.classList.contains(dataObj.data)) {
        node.classList.add(dataObj.data);
      }
        
      this.$register.regist(this.$data, dataObj.path, function(old, now){
        node.classList.remove(old);
        node.classList.add(now);
      });
    }
      
  }

  lp.parseModel = function(node) {

    if (node.getAttribute('lait-model')) {
      var modelName = node.getAttribute('lait-model');
      var dataObj = this.parseData(modelName, node);

      if (node.tagName === 'INPUT') {
        node.value = dataObj.data;
      } else {
        node.innerText = dataObj.data;
      }

      this.$register.regist(this.$data, dataObj.path, function(old, now) {
        if (node.tagName === 'INPUT') {
          node.value = now;
        } else {
          node.innerText = now;
        }
      });

    }
      
  }

  lp.parseList = function (node) {
      var _this = this
    //   console.log('NODE')
    //   console.log(node.path)
      var parsedItem = this.parseListItem(node);
      var itemEl = parsedItem.itemEl;
      var parentEl = parsedItem.parentEl;
      var list = node.getAttribute('lait-list');
      var listData = this.parseData(list, node);
      listData.data.forEach(function(_dataItem, index) {
        const copyItem = itemEl.cloneNode(true);
        copyItem.$data = _dataItem;
        //if (node.path) {
          copyItem.path = node.path.slice();
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
        thisListData.data.forEach(function(_dataItem, index){
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
    }
  
    lp.parseListItem = function(node) {
      var me = this;
      var target;
        
      (function getItem(nodeToScan) {
          var tmp = [...nodeToScan.children]
        tmp.forEach(function(thisNode) {
          if (nodeToScan.path) {
            thisNode.path = nodeToScan.path.slice();
          }
          if (thisNode.getAttribute('lait-list-item')) {
            target = {
              itemEl: thisNode,
              parentEl: nodeToScan
            }
          } else {
            me.parseEvent(thisNode);
            me.parseClass(thisNode);
            me.parseModel(thisNode);
            getItem(thisNode);
          }
        });
          
      }(node));
        
      return target;
    }



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