
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
  