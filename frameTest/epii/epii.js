/**
 * Created by MrRen on 2017/7/14.
 * 模板数据绑定和事件绑定的快速实现
 * 不依赖任何第三方库
 * var myepii = epii(dom);
 * myepii.setData();//设置数据
 * myepii.addData();//追加数据
 *
 * console.log(myepii.getDataValue("name"));
 console.log(myepii.getDataValue("list",1,"age"));
 console.log(myepii.getDataValue("list",4,"wanju",1,"name"));
 *
 */

;(function () {

    var _r_data_tag = "r-data", 
    _r_list_tag = 'r-list', 
    _r_display = 'r-display', 
    _r_click_function = 'r-click-function',
    _r_click_change = 'r-click-change',
    _in_it_common = "_in_it_common", 
    _r_style = "r-style", 
    _r_empty = "r-empty",
    _r_default = "r-data-default"
    ;

    var click_change_function = function (url) {
        if (window)
            window.location.href = url;
        else {
            console.log("请使用epii.setClickToChangeFunction设置点击事件");
        }
    }, 
    enable_r_tag_show = false, 
    $_templateParser = null;

    function getValueByKeyPath(data, keypaths) {
        if (keypaths == null) return data;
        
        var i = 0, 
            out = data[keypaths[i++]], 
            len = keypaths.length
            ;

        while (i < len) {
            if (out === undefined)  return null;
            out = out[keypaths[i++]];
        }
        return out;
    }

    function hasAttribute(attrName) {
        return typeof this[attrName] !== 'undefined';
    }

    function $templateParser(key, data) {
        if (data === undefined || data === null) return undefined;
        
        var value = "";
        if (key && key.indexOf("{") !== -1) {

            value = key.replace(/{(.*?)}/gi, function () {
                // console.log(arguments[1]);
                var key_path = arguments[1].split(".");
                var out = getValueByKeyPath(data, key_path);
                // console.log(key_path);
                // console.log(out);
                if (out === null) {
                    return null;
                }
                if (out != undefined) {
                    return out;
                } else {
                    
                    if ($_templateParser) {
                        return $_templateParser(arguments[1], key_path)
                    }

                    return undefined;
                }
            });
        }
         else {

            var out = data[key];
            if (out != undefined && out != null) {
                value = out;
            } else {
                value = key;
            }

        }

        if (value == "null") return null;
        if (value == "undefined") return undefined;
        
        return value;

    }

    function get_epii_mode(group) {
        var out = {
            data: {},
            view_group: null,
            root_key_view: {}, // key 是 { } 符号之间的变量名, value 是 get_group_from_dom(root) 返回数组的每一项
            is_data_set: false,
            
            init: function (group) {
                // console.log(group);
                this.view_group = group;
                var keytemp;
                for (var i = 0; i < group.length; i++) {

                    if (group[i].key.indexOf("{") !== -1) { // 包含 {

                        var keys = group[i].key.match(/{(.*?)}/gi); // 完全匹配 [{params}]

                        for (var j = 0; j < keys.length; j++) {
                            keys[j] = keys[j].substring(1, keys[j].length - 1); // 去除 { } 符号
                            keytemp = (group[i].view._keypath.length == 0) ? 
                                        keys[j] 
                                        : 
                                        group[i].view._keypath + "." + keys[j];

                            if (!this.root_key_view[keytemp]) this.root_key_view[keytemp] = [];
                            this.root_key_view[keytemp].push(group[i]);
                        }

                    } 
                    else {

                        keytemp = (group[i].view._keypath.length == 0) ? 
                                            group[i].key 
                                            : 
                                            group[i].view._keypath + "." + group[i].key;

                        if (group[i].type == _r_data_tag || group[i].type == _r_list_tag) {


                            if (!this.root_key_view[keytemp]) this.root_key_view[keytemp] = [];
                            this.root_key_view[keytemp].push(group[i]);
                        } else {
                            if (!this.root_key_view[_in_it_common]) this.root_key_view[_in_it_common] = [];
                            this.root_key_view[_in_it_common].push(group[i]);
                        }

                    }

                }
                //console.log(this.root_key_view);
                return this;
            },

            setData: function (data) {

                var group = [];
                if (this.root_key_view[_in_it_common]) {
                    group = group.concat(this.root_key_view[_in_it_common]);
                }
                var datagroup = [{todata: this.data, data: data, keypath: []}];
                var tmpkeypath;
                while (datagroup.length > 0) {
                    var subdata = datagroup.shift();

                    for (var index in subdata.data) {

                        if (
                            ( subdata.data[index] instanceof Array) ||  // 是数组
                            (!subdata.data[index]) ||   // 当前值 !! 为false
                            (!(subdata.data[index] instanceof Object) ) // 不是对象
                        ) {
                            subdata.todata[index] = subdata.data[index]; // 赋给 todata 属性
                            tmpkeypath = subdata.keypath.concat(index).join(".");

                            if (this.root_key_view[tmpkeypath])
                                group = group.concat(this.root_key_view[tmpkeypath]);

                        } 
                        else {
                            subdata.todata[index] = {};

                            datagroup.push({
                                todata: subdata.todata[index],
                                data: subdata.data[index],
                                keypath: subdata.keypath.concat(index)
                            });
                        }

                    }
                }

                if (!this.is_data_set) {
                    this.renderView(this.view_group, this.data, false);
                    this.is_data_set = true;
                } else
                    this.renderView(group, this.data, false);
                return this;

            },

            addData: function (data) {
                var group = [];
                for (var index in data) {

                    if (data[index] instanceof Array) {

                        if (!this.data[index]) this.data[index] = [];
                        for (var i = 0; i < data[index].length; i++) {
                            this.data[index].push(data[index][i]);
                        }

                    } else {
                        this.data[index] = data[index];
                    }

                    if (this.root_key_view[index])
                        group = group.concat(this.root_key_view[index]);
                }

                this.renderView(group, data, true);
                return this;
            },

            getData: function () {
                return this.data;
            },

            getDataValue: function (key) {
                return getValueByKeyPath(this.data, arguments);
            },

            renderView: function (group, data, isadd) {

                var userdata = {};
                for (var i = 0; i < group.length; i++) {
                    userdata = getValueByKeyPath(data, 
                                            group[i].view['_keypath'].length == 0 ? 
                                                                null 
                                                                : 
                                                                group[i].view['_keypath'].split(".")
                                        );
                    if (group[i].type == _r_data_tag) {

                        this.showValue(group[i].view, group[i].key, userdata, group[i]['d_v']);
                    } else if (group[i].type == _r_list_tag) {


                        if ((!isadd) || group[i].view['is_empty']) {
                            while (group[i].view.hasChildNodes()) //当div下还存在子节点时 循环继续
                            {
                                group[i].view.removeChild(group[i].view.firstChild);
                            }
                        }

                        var listdata = userdata[group[i].key];

                        if (listdata === undefined || listdata === null || listdata.length == 0) {

                            if ((!isadd) && (!group[i].view['is_empty']) && group[i].empty_view) {
                                group[i].view.appendChild(group[i].empty_view);
                                group[i].view['is_empty'] = true;

                            }

                            return;
                        }

                        group[i].view['is_empty'] = false;
                        var template_index = 0;
                        var template_display_string = [];

                        if (group[i].template.length > 0) {

                            for (var he = 0; he < group[i].template.length; he++) {
                                template_display_string.push(group[i].template[he].view.getAttribute(_r_display));

                            }

                        }

                        for (var j = 0, item = {}; j < listdata.length; j++) {

                            if (typeof listdata[j] != "object") {
                                item = {value: listdata[j]}
                            } else {
                                item = listdata[j];
                            }

                            for (he = 0; he < template_display_string.length; he++) {
                                rdisplay = template_display_string[he];

                                if ((rdisplay !== null) && this.getBool(rdisplay, item)) {
                                    template_index = he;
                                    break;
                                }
                            }


                            var clone = group[i].template[template_index].view.cloneNode(true);

                            var groups = get_group_from_dom(clone);
                            this.renderView(groups, item);

                            //  console.log(clone.onclick);
                            group[i].view.appendChild(clone);


                        }
                    } else if (group[i].type == _r_display) {

                        this.displayView(group[i].view, group[i].key, userdata);
                        
                    } else if (group[i].type == _r_click_function) {

                        this.clickFunction(group[i].view, group[i].key, userdata);

                    } else if (group[i].type == _r_click_change) {

                        this.clickChange(group[i].view, group[i].key, userdata);

                    } else if (group[i].type == _r_style) {

                        this.viewStyle(group[i].view, group[i].key, userdata);

                    } else if (group[i].type == "attr") {

                        this.viewAttr(group[i].view, group[i].key, userdata, group[i].attr_name);

                    }
                }
            },

            showValue: function (view, value, data, defaultvalue) {

                var v = $templateParser(value, data);

                if (v === null) {

                    v = "";
                } else if (v === undefined || v == "undefined") {
                    if (defaultvalue) {
                        v = $templateParser(defaultvalue, data);
                    }
                    if (v === undefined || v == "undefined") {
                        v = "";
                    }
                }


                var tagname = view.tagName.toLowerCase();
                if (tagname == "input") {
                    view.value = v;
                } else if (tagname == "img") {
                    view.src = v;
                } else
                    view.innerHTML = v;

                if (!enable_r_tag_show)
                    view.removeAttribute(_r_data_tag);
            },

            displayView: function (view, value, data) {

                var string = $templateParser(value, data);

                if (string.indexOf("{") == -1) {

                    var viewstyle = view.currentStyle ? 
                                    view.currentStyle 
                                    : 
                                    document.defaultView.getComputedStyle(view, null);

                    if (eval(string)) {

                        if (viewstyle["display"] == "none") {
                            if (view.displayValue) {
                                view.style.display = view.displayValue;
                            } else
                                view.style.display = "block";
                        }

                    } else {

                        if (viewstyle["display"] != "none") {
                            view.displayValue = viewstyle["display"];
                        }
                        view.style.display = "none";
                    }

                }

                if (!enable_r_tag_show)
                    view.removeAttribute(_r_display);
            },

            viewAttr: function (view, value, data, attr_name) {

                var string = $templateParser(value, data);
                view.setAttribute(attr_name, string);

            },

            viewStyle: function (view, value, data) {

                var string = $templateParser(value, data);
                view.setAttribute("style", string);

                if (!enable_r_tag_show)
                    view.removeAttribute(_r_style);
            },

            clickFunction: function (view, value, data) {

                var string = $templateParser(value, data);
                var arr = string.split("#");
                var to = arr[0];

                view.onclick = function () {

                    var arg = [];

                    for (var i = 1; i < arr.length; i++) {
                        arg.push(arr[i]);
                    }
                    arg.push(data);

                    window[to].apply(view, arg);
                };

                if (!enable_r_tag_show)
                    view.removeAttribute(_r_click_function);
            },

            clickChange: function (view, value, data) {

                var string = $templateParser(value, data);
                view.onclick = function () {

                    if (click_change_function) {
                        click_change_function.call(view, string);
                    }
                };
                if (!enable_r_tag_show)
                    view.removeAttribute(_r_click_change);

            },

            getBool: function (value, data) {

                var string = $templateParser(value, data);

                if (string.indexOf("{") == -1) {
                    if (eval(string)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            }

        };
        return out.init(group);
    }


    function get_group_from_dom(root) {
        

        function getOneItem(groupobj, item) {
            
            //  console.log(item["_keypath"]);
            var key = item.getAttribute(_r_data_tag);

            if (key) {
                // console.log(key+":"+item.childElementCount);

                if (item.childElementCount > 0) { // 有子元素

                    if (key.indexOf("{") > -1) {
                        key = key.substring(1, key.length - 1);
                    }

                    item["_keypath"] = item["_keypath"] ? 
                                    (item["_keypath"].length == 0 ? key : (item["_keypath"] + "." + key)) 
                                    : 
                                    key;
                    return false;
                } else {
                    groupobj.push(
                        {
                            type: _r_data_tag,  // tag
                            view: item,         // 当前对象
                            key: key,       // r-类 属性值
                            d_v: item.getAttribute(_r_default) // r-data-default 属性值
                        }
                    );
                }


            } else {
                key = item.getAttribute(_r_list_tag);
                if (key) {
                    var onnode = {
                        type: _r_list_tag, 
                        view: item, 
                        key: key, 
                        template: [], 
                        empty_view: null
                    };

                    var hh = 0;
                    for (var h = 0; h < item.childNodes.length; h++) {
                        if (item.childNodes[h].nodeType === 1) {

                            if (!item.childNodes[h].hasAttribute) {
                                item.childNodes[h].hasAttribute = hasAttribute;
                            }
                            if (item.childNodes[h].hasAttribute(_r_empty)) {
                                onnode.empty_view = item.childNodes[h];
                            } else
                                onnode.template.push({view: item.childNodes[h], group: []});

                            hh++;
                        }
                    }

                    while (item.hasChildNodes()) //当div下还存在子节点时 循环继续
                    {
                        item.removeChild(item.firstChild);
                    }

                    groupobj.push(onnode);
                    return true;

                }
                else {

                    //  groups.push({obj: subgroup.obj, root: item});
                }


            }
            // console.log(key);
            orderAttr(groupobj, item);
            return false;

        }

        function orderAttr(obj, item) {

            key = item.getAttribute(_r_display);
            if (key) {
                obj.push({type: _r_display, view: item, key: key});
            }

            key = item.getAttribute(_r_click_function);
            if (key) {
                obj.push({type: _r_click_function, view: item, key: key});
            }

            key = item.getAttribute(_r_click_change);
            if (key) {
                obj.push({type: _r_click_change, view: item, key: key});
            }

            key = item.getAttribute(_r_style);
            if (key) {
                obj.push({type: _r_style, view: item, key: key});
            }


            var attrs = item.attributes,  // dom对象的所有属性
                name, 
                value;
            for (var i = 0; i < attrs.length; i++) {
                name = attrs[i].nodeName;
                if (name.indexOf("r-") !== 0) { // 不是 r- 开头的属性
                    value = attrs[i].nodeValue;
                    if (value && 
                        value["substring"] && 
                        (value.indexOf("{") !== -1) // 包含 '{'
                    ) {
                        obj.push(
                            {
                                type: "attr", 
                                view: item, 
                                key: value, 
                                "attr_name": name
                            }
                        );
                    }
                }
            }
        }

        root['_keypath'] = "";

        var rView = [], 
            groups = [{obj: rView, root: root}];

        while (groups.length > 0) {
            var subgroup = groups.shift(), // 从数组头部 取一个, 数组长度减一
                node = subgroup.root;

            if (getOneItem(subgroup.obj, node))  continue
            
            var i = 0, 
                childNodes = node.childNodes, 
                item;
            // console.log(childNodes);
            for (; i < childNodes.length; i++) {
                item = childNodes[i];

                if (item.nodeType === 1) { //  nodeType: (1 是元素 / 2 是属性/ 3 是文本)
                    //递归先序遍历子节点
                    item['_keypath'] = node['_keypath'];
                    groups.push({obj: subgroup.obj, root: item});
                    //getOneItem(subgroup.obj, item);
                }
            }
        }

        return rView;
    }

    function epii(root) {

        var tmp1 = get_group_from_dom(root) // 收集 [{type, view, key, attr_name}]
        console.log(tmp1)
        var tmp2 = get_epii_mode(tmp1)
        return tmp2;

    }

    // epii.setClickToChangeFunction = function (callback) {
    //     click_change_function = callback;
    //     return epii;
    // };
    // epii.setEnableRtagShow = function (b) {
    //     enable_r_tag_show = b;
    //     return epii;
    // };
    // epii.setTemplateParser = function (f) {
    //     $_templateParser = f;
    //     return epii;
    // };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = epii;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return epii;
        });
    } else {

        this.epii = epii;
    }
}).call(this || (typeof window !== 'undefined' ? window : global));