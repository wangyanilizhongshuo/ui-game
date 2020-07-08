/* 微信小程序 转 uniapp
    1.wx=>uni
    2.this.data=>this.$data
    3.uniapp无setData相关函数, 添加翻译后的setData函数
*/

import Vue from 'vue'
// colorui 自定义导航栏获取数据 在App.vue的 onLaunch周期中 获得系统信息
function cu_nav(e) {
    // let Vue = await import('vue');

    console.log('colorui 自定义导航栏获取系统信息', arguments);
    // custom_menu 自定义菜单数据 单位px
    //   格式: {width: 87,height: 32,left: 278,right: 365,top: 26,bottom: 58,}
    var custom_menu = {
        width: 87,
        height: 32,
        right_distance: 10,
        // to_nav_head_top 6, // Nexus->8
    };
    uni.getSystemInfo({
        success: function(e) {
            console.log('getSystemInfo success', arguments);
            var systemInfo = e;
            var custom;
            var StatusBar;
            var CustomBar;

            Vue.prototype.StatusBar = e.statusBarHeight;


            /* 菜单按钮/胶囊按钮
                uni.getMenuButtonBoundingClientRect()
                兼容性:
                    支持:   
                        微信小程序 
                        百度小程序 
                        头条小程序 
                        QQ小程序 
                    不支持:  
                        5+App(APP-PLUS) 
                        H5(H5) 
                        支付宝小程序(MP-ALIPAY) 

                    MP==>所有小程序
            */

            // #ifndef MP
            if (e.platform == 'android') {
                Vue.prototype.CustomBar = e.statusBarHeight + 50;
            } else {
                Vue.prototype.CustomBar = e.statusBarHeight + 45;
            };
            // #endif

            // #ifdef MP-ALIPAY
            Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
            // #endif
            if (Vue.prototype.CustomBar) {
                var right = systemInfo.screenWidth - custom_menu.right_distance;
                var left = right - custom_menu.right_distance;
                var Y_diff = (Vue.prototype.CustomBar - e.statusBarHeight - custom_menu.height) / 2;
                custom = {
                    ...custom_menu,
                    right: right,
                    left: left,
                    top: e.statusBarHeight + Y_diff,
                    bottom: e.statusBarHeight + Y_diff + custom_menu.height,
                }
                Vue.prototype.Custom = custom;
            }

            // #ifdef MP
            // #ifndef MP-ALIPAY
            custom = wx.getMenuButtonBoundingClientRect();
            Vue.prototype.Custom = custom;
            Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            // #endif     
            // #endif     

        }
    })
}

// 修改页面变量值 兼容uni  添加setData函数
function setData(obj) {
    console.log('setData', obj);
    // console.log('setData', this, obj);
    let that = this;
    let keys = [];
    let val, data;
    Object.keys(obj).forEach(function(key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function(key2, index) {
            if (index + 1 == keys.length) {
                that.$set(data, key2, val);
            } else {
                if (!data[key2]) {
                    that.$set(data, key2, {});
                }
            }
            data = data[key2];
        })
    });
}


/* 
    常用代码示例
    
    if (obj.currentTarget) {
        obj = obj.currentTarget.dataset;
    }


    // 首页导航
    getNav() {
        console.log('获取首页导航');
        util.https('nav', undefined, 'GET').then(res => {
            console.log('获取首页导航 接口调取成功', res);
            this.setData({
                navlist: res.data || [],
            })
        }).catch(e => {
            console.log(e)
        })
    },


    // console.log(this, wx, wx.do, wx.do_judge);
    // console.log('wx.do--自定义延迟执行wx方法, 参数一填对应方法, 后面是原来参数');
    // 小程序 个人自定义函数
    wx.do = function(method, ...obj) {
        if (wx.do_judge) {
            console.log(method + '正在执行, 1.5秒后可执行');
            return;
        } else {
            wx.do_judge = true;
            setTimeout(() => {
                wx.do_judge = false;
            }, 1500)
        }
        setTimeout(() => {
            wx[method](...obj);
        }, 1000)
    };

*/

// 登录页面
var login_url = '/pages/common/login/login';

// 页面名称简化 set_pages() 用于app.js
// console.log(__wxConfig);
function set_pages() {
    console.log('页面名称简化');
    var {
        pages
    } = __wxConfig;
    var arr, str, obj = {};
    pages_for: for (var i = pages.length - 1; i >= 0; i--) {
        arr = pages[i].split('/');
        if (arr[0] == '') {
            arr.shift();
        }
        page_for: for (var j = arr.length - 1; j >= 0; j--) {
            str = arr[j];
            if (str == 'pages' && j == 0) {
                str = arr[arr.length - 1];
                break page_for;
            }
            if (str != 'index') {
                if (arr[1] != str) {
                    str = arr[1] + '_' + str;
                }
                if (obj[str]) {
                    // str = arr[1] + '_' + str;
                    // if (obj[str]){
                    str += 2;
                    // }
                }
                // console.log(str);
                break page_for;
            }
        }
        obj[str] = pages[i];
    }
    console.log(obj);
    return obj;
}
// set_pages();  


// 变量路径拆分 var_path_split({path, start, is_data:true, _this}) path->路径 start->初始值
function var_path_split({
    path,
    start,
    is_data = true,
    _this
}) {
    var reg = /[^\[\]\.]+/g;
    var arr = path.match(reg);

    var var_v = start || (is_data ? (_this || this).$data : _this); // var_value
    console.log('变量路径拆分', {
        path,
        start
    });
    var new_path = arr[0];
    for (let v of arr) {
        if (var_v == undefined) {
            console.log('添加', {
                new_path,
                var_v,
                v
            })
            if (isNaN(v)) {
                var_v = {};
            } else {
                var_v = [];
            }
            if (is_data) {
                var that = _this || this;
                console.log(this, new_path);
                that.setData({
                    [new_path]: var_v,
                })
            }
        }
        var_v = var_v[v || var_v.length];
        if (v != new_path) {
            // console.log(v, isNaN(v));
            if (isNaN(v)) {
                new_path += '.' + v;
            } else {
                new_path += `[${v}]`;
            }
        }
    }
    console.log('变量路径拆分返回值: ', var_v);
    return var_v;
}

// 设置自定义参数
function dataset(e) {
    // console.log('设置自定义参数', e);
    if (e) {
        var param = e.currentTarget.dataset.param;
        param && (param = JSON.parse(param));
        var obj = {
            ...e.detail,
            ...e.currentTarget.dataset,
            // ...e.currentTarget.dataset.param,
        };
        param && (obj = { ...obj, ...param });
        return obj;
    } else {
        return {};
    }
}

// 应用到util的 request请求函数 与 delayJump延迟跳转函数
var util = require('./wjw_util.js');


// 判断请求网站, 是否添加前缀;  getUrl(url);
function getUrl(url){
    console.log('判断请求网站, 是否添加前缀', url, url.indexOf('://') == -1, getApp().globalData.api);
    if (url.indexOf('://') == -1) {
        // console.log('this.$scope', this.$scope);
        // console.log('getApp()', getApp());
        url = getApp().globalData.api + url;
        // var config = require("../utils/config");
        // url = config.url + url;
    }
    if(
        window
        && window.location
        && window.location.protocol
        && ['http:', 'https:'].indexOf(window.location.protocol)!=-1
    ){
        // console.log('判断请求网站, 是否添加前缀 判断当前协议 window.location.protocol', window.location.protocol);
        // console.log('判断请求网站, 是否添加前缀 判断当前协议 getApp().globalData.api', getApp().globalData.api);
        url=url.replace(/^(http|https):/, window.location.protocol);
    }
    return url
}


// 延迟跳转
function delayJump(url = '/pages/index/index', duration = 1000, type = 1) {
    console.log('延迟跳转', {
        url,
        duration,
        type
    });
    setTimeout(function() {
        var method = '';
        type -= 0;
        switch (type) {
            case 0:
                method = 'navigateBack'; //返回上一页
                break;
            case 1:
                method = 'navigateTo'; //跳转
                break;
            case 2:
                method = 'redirectTo'; //关闭当前页面，跳转
                break;
            case 3:
                method = 'switchTab'; // 跳转到tabbar页面
                break;
            case 4:
                method = 'reLaunch'; // 关闭所有页面，跳转
                break;
            case 5:
                console.log('路由判断 返回/跳转', url);
                return
                break;
            default:
                break;
        }
        if(method&&uni[method]){
            uni[method]({
                url: url,
                fail(err) {
                    console.log('页面不存在', err);
                    toastTip('页面不存在');
                }
            })
        }else{
            console.log('方法不存在', method);
        }
    }, duration)
};

// 网络请求 对象参数
function buildRequest({
    url = '',
    param = {},
    method = 'POST',
    isDebug = false,
    isshowLoading = false
} = {}) {
    console.log('网络请求', {
        url,
        param,
        method,
        isDebug,
        isshowLoading,
    });
    if (isshowLoading) {
        uni.showLoading({
            title: '请求中...'
        });
    }
    let timeStart = Date.now();
    return new Promise((resolve, reject) => {
        uni.request({
            url: getUrl(url),
            data: param,
            method: method,
            header: {
                'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
                'token': uni.getStorageSync('token'),
            },
            complete: (res) => {
                if (isshowLoading) {
                    uni.hideLoading()
                }
                if (isDebug) {
                    console.log(`耗时${Date.now() - timeStart}`);
                    console.log(res.data)
                }
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }
        })
    })
}

// 网络请求 一对一参数
function request(url, param = {}, method = 'POST', isDebug, isshowLoading) {
    return buildRequest({
        url,
        param,
        isDebug: isDebug,
        isshowLoading: isshowLoading,
        method: method
    })
}

// 提示信息
function toastTip(msg = 'Error', icon = 'none', duration = 1000) {
    uni.showToast({
        title: msg,
        icon: icon,
        duration: duration
    })
}


// 提示加载信息
function loadTip(msg = '加载中...') {
    uni.showToast({
        title: msg,
        mask: true,
        icon: 'loading',
        // #ifdef MP-ALIPAY
        icon: 'none',
        // #endif
        duration: 55000,
    });
}

//  登录检测
function login_check() {
    console.log('登录检测');
    let token = uni.getStorageSync('token');
    return token;
}

// 页面跳转 基于delayJump延迟跳转函数
// 参数: 1.data-url 页面地址; 2.data-type 跳转类型; 3.data-time 跳转延迟时间; 4.data-check 跳转前判断; 其他皆为传递参数
function jump(e) {
    var obj = dataset(e);
    console.log('页面跳转', e, e.currentTarget.dataset.url, obj);

    var fixed_param_arr = ['url', 'time', 'type', 'check', 'phone_check', 'param']; //固定参数数组
    var {
        url,
        time = 0,
        type,
        check,
        phone_check,
    } = obj;
    if (!url) {
        console.log('无跳转页面', url);
        return
    }

    // console.log(login_check);
    // 登录检测
    if (check) {
        // login_check 登录检测
        if (login_check && login_check()) {
            console.log('跳转到登录页面', e);
            delayJump(login_url, 0);
            return;
        }
    }

    if (uni.jump) {
        console.log('正在页面跳转, ' + uni.jump_time + '秒后可点击');
        return;
    } else {
        uni.jump = true;
        uni.jump_time = time / 1000 + 0.5;
        setTimeout(() => {
            uni.jump = false;
        }, time + 500)
    }

    var param = '?'; //存储拼接的参数
    for (let i in obj) {
        if (fixed_param_arr.indexOf(i) != -1) {
            continue
        }

        if (param != '?') {
            param += '&'
        }
        param += `${i}=${obj[i]}`;
    }
    if (param == '?') {
        param = '';
    }

    // 手机号检测
    if (phone_check) {
        console.log('需要绑定手机号, 判断用户是否绑定手机号');
        var {
            user_info
        } = getApp().globalData;
        if (!user_info) {
            // toastTip('需要绑定手机号');
            getApp().globalData.phone_check_data = {
                url: type == 3 ? url : (url + param),
                type,
            }
            delayJump(`/${getApp().globalData.page_data.pages.common_accounts}`);
            return;
        }
    }
    console.log('跳转地址: ', url + param);
    delayJump(type == 3 ? url : (url + param), time, type);
}

// 随机范围
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// 随机色
function color_random() {
    console.log('随机色');

    var r = random(0, 255);
    var g = random(0, 255);
    var b = random(0, 255);
    // console.log('rgb('+r+','+g+','+b+')');
    return 'rgb(' + r + ',' + g + ',' + b + ')';

}

/* html input 禁止输入中文
    <input type="text" class="tel" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" placeholder="请输入账号" />
*/

/* 只能输入中文的
    <input id='txt' onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\u4E00-\u9FA5]/g,''))" >只能输入中文的
*/

/* 只能输入数字
    <input onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">只能输入数字
*/

// 验证邮箱
function is_email(email) {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");;
    if (reg.test(email)) {
        console.log("邮箱正确");
        return true;
    } else {
        console.log("邮箱错误");
        return false;
    }
}

// 验证手机号
function is_phone(phone) {
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
    if (reg.test(phone)) {
        console.log("手机号正确");
        return true;
    } else {
        console.log("手机号错误");
        return false;
    }
}

// 验证中文
function is_zh_CN(name, length = 3) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    if (name.length > length) {
        console.log("文字字数超出", name, length);
        return false;
    }
    var reg = /[\u4e00-\u9fa5]/ig;
    if (reg.test(name)) {
        console.log("文字为全中文");
        return true;
    } else {
        console.log("文字非全中文");
        return false;
    }
}

// 验证身份证号码
function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card)) {
        console.log("身份证输入合法");
        return true;
    } else {
        console.log("身份证输入不合法");
        return false;
    }
}


// 获取列表 请求依赖request函数
function get_list({
    name, // string, 列表名称
    list_name = 'list', // string, page_data中对应的列表属性名, 默认为'list'
    dyadic_arr_index, // 二维数组下标, number
    page_prop = 'page', // string, page_data中对应的页码属性名, 默认为'page'
    page = (page_prop ? this.$data[page_prop] : this.$data.page) || 1, // number, 页码, 此处用到形参page_prop, 所以位置要在形参page_prop之后
    size_prop = 'size', // string, size有值，而size_prop无实参时，默认size_prop为字符串size
    size = (size_prop ? this.$data[size_prop] : this.$data.size) || 10, // number, 每页数量
    loading_prop = 'loading',

    url, //请求地址
    request_param, // obj, 请求传递的其他参数对象集合(page与size固定，不在此参数中，会被此对象属性替换)
    method = 'post',
    data_prop, // 在 返回数据列表 中需要提取的属性, 单个属性可以是字符串, 正常是数组, 缩减数据

    res_data, // 二级数据

    request_page1_fn, // page为1时执行的函数(在发送请求前执行)
    request_before_fn, // page不为1时执行的函数(在发送请求前执行)

    request_back_page1_fn, // page为1时请求后的执行函数
    request_back_fn, // 请求后的额外回调函数, 在get_list自带请求成功代码后 执行
    // request_stop_fn, // 请求后的数据如果小于size或res.size
    request_stop_fn, // 请求后的数据如果长度等于0

}) {
    console.log(`获取${name || list_name}列表`, list_name, page_prop, page);
    var const_size = 10;

    var event_data = '';
    typeof page == 'object' && (
        event_data = dataset(page),
        console.log(event_data),
        page = (event_data.page - 0) || (page_prop ? this.$data[page_prop] : this.$data.page) || 1,
        size = (event_data.size - 0) || size
    );
    console.log({
        page,
        size,
    });
    if (typeof page != 'number') {
        page = Number(page);
        console.log({
            page
        });
        isNaN(page) && (
            page = 1,
            console.log('page', page)
        );
    }


    // page自增长, 同步page_data对应记录页面数据
    var obj = {
        [loading_prop]: true,
    };

    if (size_prop) {
        if (size) {
            obj[size_prop] = size;
        } else {
            size = this.$data[size_prop];
        }
    } else if (size) {
        obj.size = size;
    } else if (this.$data.size) {
        size = this.$data.size;
    }
    console.log(obj);
    this.setData(obj);

    if (page == 1) {
        console.log(`${name || list_name}列表刷新`, `${list_name}${dyadic_arr_index||""}`);
        this.setData({
            [`${list_name}${dyadic_arr_index || ""}`]: []
        });

        if (request_page1_fn && request_page1_fn()) {
            return;
        }
    } else {
        if (request_before_fn && request_before_fn()) {
            return;
        }
    }

    console.log({
        list_name
    });
    if (this[list_name + '_request']) {
        this[list_name + '_request']++;
    } else {
        this[list_name + '_request'] = 1;
    }
    var list_request = this[list_name + '_request'];
    console.log({
        list_request
    });
    (util.https ? util.https : request)(url, {
        page,
        size,
        ...request_param,
    }, method)
    .then(res => {
            console.log(`${name || list_name}列表 接口调取成功`, res);

            if (list_request != this[list_name + '_request']) {
                console.log(
                    `非${list_name}列表最近请求的数据, 不执行页面数据对接`,
                    list_request,
                    this[list_name + '_request']
                );
                return;
            }

            this.setData({
                [loading_prop]: false,
            })

            var back_data = res_data ? res.data[res_data] : res.data;
            if (back_data) {

                if (back_data.length) {
                    // 页码加一
                    obj[page_prop] = page + 1;
                    console.log(obj);
                    this.setData(obj);
                }

                obj = {};
                obj[list_name] = this.$data[list_name] || [];
                if (page == 1) {
                    if (typeof dyadic_arr_index == 'number') {
                        obj[list_name][dyadic_arr_index] = [];
                    } else {
                        obj[list_name] = [];
                    }
                    console.log(
                        `${name || list_name}${typeof dyadic_arr_index == 'number' && '第' + (dyadic_arr_index + 1) + '页' || ''}列表刷新完毕`);
                    if (request_back_page1_fn && request_back_page1_fn(res)) {
                        return;
                    }
                }

                // 简化数据
                console.log('简化数据参数', typeof data_prop);
                data_prop && back_data.forEach((item, index, arr) => {
                    // console.log({ item, index, arr }, typeof data_prop);
                    // item.sss='1';//可修改
                    var obj = {};
                    if (typeof data_prop == 'string') {
                        obj[data_prop] = item[data_prop];
                    } else if (typeof data_prop == 'object') {
                        for (let i of data_prop) {
                            obj[i] = item[i];
                        }
                    }
                    arr[index] = obj;
                });

                if (typeof dyadic_arr_index == 'number') {
                    obj[list_name][dyadic_arr_index].push(...back_data);
                } else {
                    obj[list_name].push(...back_data);
                }

                console.log({
                    obj,
                    list_name
                })
                this.setData(obj);
                console.log(this.$data[list_name]);

                if (request_back_fn && request_back_fn(res)) {
                    return;
                }

                // console.log( back_data.length, size, const_size, back_data.length < size || const_size );
                // if (back_data.length < (size || const_size)) {
                if (back_data.length == 0) {
                    // toastTip(res.msg);
                    console.log(`${name || list_name}列表无后续数据, 结束后续操作`);
                    // console.log(this);
                    if (request_stop_fn && request_stop_fn(res)) {
                        return;
                    }
                }

            } else {
                // toastTip(`第${page}页${name || list_name}获取失败, 暂无获取失败页操作， 可重新刷新该页面或联系客服升级VIP开通该功能`);
                toastTip(`第${page}页${name || list_name}获取失败, ${res.msg}, 请刷新页面`);
                console.log(`第${page}页${name || list_name}获取失败`);
                // this.setData({ opus_page: page });
            }

        })
        .catch(e => {
            console.log(`获取${name}列表 报错`, e);
            this.setData({
                [loading_prop]: false,
            })
        });
}

// 拨打电话
function call(e) {
    console.log('拨打电话', e);
    var _dataset = dataset(e);
    var {
        phone = _dataset.phone
    } = this.$data;
    console.log({
        phone
    });

    // 转化为字符串
    phone += '';

    console.log(phone);
    uni.makePhoneCall({
        phoneNumber: phone
    })
}

// 判断字符串是否为json格式
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}


// 在新页面中全屏预览图片 绑定事件 元素自定义属性(data-) ( imgs(图片数组)与index(当前图片下标) ) 或者 img(当前图片)
function preview_img(e) {
    console.log('在新页面中全屏预览图片', e);

    var {
        index = 0,
            imgs,
            img
    } = dataset(e);
    console.log({
        index,
        imgs,
        img
    });
    imgs || (imgs = [img]);
    imgs && !Array.isArray(imgs) && isJSON(imgs) && (imgs = JSON.parse(imgs))
    uni.previewImage({
        /*
            current 
                下标兼容性不好，不建议使用下标定位 index-0 || 
                注意： 小程序可以传递非字符串数据, h5不支持
                小程序：当前显示图片的http链接, 不太支持下标, 使用下标时会砍去下标前 与当前下标重复 的图片  
                h5:下标或当前显示图片的字符串
        */
        current: img || imgs[index],
        urls: imgs, // 需要预览的图片http链接列表
        success: res => {
            console.log('预览图片 小程序接口调取成功', res);
            toastTip('长按出现“保存图片”选项', undefined, 1500);
        },
        // longPressActions     兼容性: 5+App
        longPressActions: {
            // itemList: ['发送给朋友', '保存图片', '收藏'],
            // success: function(data) {
            //     console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
            // },
            // fail: function(err) {
            //     console.log(err.errMsg);
            // }
        }
    })
}

// 图片加载失败
/*
    <image  src="{{item.img||'/img/default.png'}}" lazy-load
            bindload='img_load' 
            binderror='img_err' data-arr='merchlist' data-index='{{index}}' data-name='logo' 
            data-default_img='/img/default.png'
    />

    先报错再执行失败事件
*/
function img_err(e) {
    // console.log('图片加载失败', e);
    var glo = getApp().globalData;
    var {
        src,
        arr,
        index,
        name,
        default_img = (glo.page_data && glo.page_data.default_img) || '/img/default.png'
    } = dataset(e);
    var path =
        src ||
        (
            arr ?
            name ?
            `${arr}[${index}].${name}` :
            `${arr}[${index}]` :
            name
        );
    // console.log({
    //     src,
    //     arr,
    //     index,
    //     name,
    //     default_img,
    //     path
    // });
    if (path) {
        // console.log('替换图片路径', { path });
        this.setData({
            [path]: default_img
        });
    } else {
        // console.log('无替换路径');
        return;
    }

}

// 图片加载
function img_load(e) {
    console.log('图片加载', e);
}

// 切换布尔值 bindtap='trigger' data-name='name' catchtap='trigger' 
function trigger(e) {
    var {
        name
    } = dataset(e);
    var data_v = var_path_split.call(this, {
        path: name,
        start: this.$data
    });
    console.log('切换布尔值', e, !data_v);
    this.setData({
        [name]: !data_v
    })

}

// 输入框修改属性 bindinput='input_set_value' data-name='name' data-int='{{true}}'(取整) catchtap='input_set_value'
function input_set_value(e) {
    var {
        name,
        int,
    } = dataset(e);
    var {
        value = '',
        current = '',
    } = e.detail;
    value || (value = current)
    if (int) {
        value = isNaN(parseInt(value)) ? 0 : parseInt(value);
    }
    console.log('输入框修改属性', e, {
        name,
        value
    });
    try {
        this.setData({
            [name]: value
        });
    } catch (err) {
        // 验证路径以及补齐路径
        var_path_split.call(this, {
            path: name,
            start: this.$data
        });
        this.setData({
            [name]: value
        });
    }
}

// picker修改属性 bindinput='picker_set_value' data-list_name='list_name' data-name='name'
function picker_set_value(e) {
    var {
        list_name,
        obj_name,
        name,
    } = dataset(e);
    var {
        value = 0,
        current = 0,
    } = e.detail;
    value || (value = current)
    console.log('输入框修改属性', e, {
        name,
        value
    });
    var list = var_path_split.call(this, {
        path: list_name,
        start: this.$data,
    });
    var last_value = list[value];
    obj_name && (last_value=last_value[obj_name]);
    try {
        this.setData({
            [name]: last_value,
        });
    } catch (err) {
        // 验证路径以及补齐路径
        var_path_split.call(this, {
            path: name,
            start: this.$data,
        });
        this.setData({
            [name]: last_value,
        });
    }
}

// 设置属性值 bindtap='set_value' data-name='name' data-value='{{index}}' data-method='push' catchtap='set_value'
function set_value(e) {
    var {
        name,
        value = '',
        index = 0,
        method,
        no_report,
    } = dataset(e);
    console.log('设置属性值', e, {
        name,
        value,
        method,
    });
    var name_arr = name.split(/ *[,， ] */g);
    var value_arr = [];
    if (typeof value == 'string') {
        value_arr = value.split(/ *[,， ] */g);
    } else {
        value_arr.push(value);
    }
    console.log({
        name_arr,
        value_arr
    });
    name_arr.map((item, indexs, arr) => {
        if (!item) {
            console.log('路径为空 不设置', item);
            return;
        }
        var value = value_arr[indexs] == 'false' ? false :
            (
                value_arr[indexs] == undefined ?
                value_arr[indexs - 1] || value_arr[value_arr.length - 1] :
                value_arr[indexs]
            );
        console.log({
            item,
            indexs,
            value
        }, this);
        // 验证路径以及补齐路径
        var data_v = var_path_split.call(this, {
            path: item,
            start: this.$data
        });
        if (no_report && data_v == value) {
            console.log('属性值相同, 不设置', {
                name: item,
                value,
                data_v,
            }, data_v == value);
            return
        }
        if (method == 'push' && index == indexs) {
            if (!Array.isArray(data_v)) {
                data_v = [];
            }
            data_v.push(value);
            value = data_v;
        }
        console.log('删除1111111111111', method == 'splice', method);
        if (method == 'splice' && index == indexs) {
            if (!Array.isArray(data_v)) {
                data_v = [];
            }
            var arr_index = -1;
            while ((arr_index = data_v.indexOf(value)) != -1) {
                console.log('删除', arr_index);
                data_v.splice(arr_index, 1)
            }
            console.log('删除111', data_v.indexOf(value));
            value = data_v;
        }
        console.log(item, value);
        this.setData({
            [item]: value
        })
    })
}

// 增减属性值 bindtap='count_value' data-name='name' data-count='add/min' catchtap='count_value'
function count_value(e) {
    console.log('增减属性值', e);
    var {
        name,
        count,
    } = dataset(e);
    var data_v = var_path_split.call(this, {
        path: name,
        start: this.$data
    });
    isNaN(data_v) && (data_v = 0);
    data_v = (data_v - 0) || 0;
    if (count == 'add') {
        data_v++;
    } else {
        data_v--;
    }
    this.setData({
        [name]: data_v
    })
}

// 阻止事件冒泡 catchtap='event_false'
function event_false(e) {
    console.log('阻止事件冒泡', e);
    return false;
}

//禁止滑动
function stop_swiper(e) {
    console.log('禁止滑动', e);
    return true;
}

// 显示提示
function showToast(e) {
    console.log('显示提示', e);
    var {
        title = '提示',
            icon = 'none',
            duration = 2000,
    } = dataset(e);
    uni.showToast({
        title,
        icon,
        duration,
    });
}

// 执行多个方法 bindtap="do_fns" data-fns='fn1 fn2'
function do_fns(e) {
    console.log('执行多个方法', e);
    var {
        fns,
    } = dataset(e);
    var fn_arr = fns.split(/ *[,， ] */g);
    fn_arr.map((item, index, arr) => {
        console.log({
            item,
            index
        });
        item&&this[item](e);
    });
}

const getUrl = (url) => {
    console.log('判断请求网站, 是否添加前缀', url, url.indexOf('://') == -1, getApp().globalData.api);
    if (url.indexOf('://') == -1) {
        // console.log('this.$scope', this.$scope);
        // console.log('getApp()', getApp());
        url = getApp().globalData.api + url;
        // var config = require("../utils/config");
        // url = config.url + url;
    }
    if(
        window
        && window.location
        && window.location.protocol
        && ['http:', 'https:'].indexOf(window.location.protocol)!=-1
    ){
        // console.log('判断请求网站, 是否添加前缀 判断当前协议 window.location.protocol', window.location.protocol);
        // console.log('判断请求网站, 是否添加前缀 判断当前协议 getApp().globalData.api', getApp().globalData.api);
        url=url.replace(/^(http|https):/, window.location.protocol);
    }
    return url
}

// 上传文件 递归调用 需要页面this
function uploadFiles({
    file, //array []
    i = 0,
    url = getApp().globalData.api + 'upload',
    name = 'file',
    data_name = 'files',
    header,
    is_new = false,
    res_name = 'url',
    back_fn,
}) {
    url = getUrl(url);
    console.log("上传文件", file[i]);

    // prompt('上传文件 file[i] '+ (i + 1), file[i]);

    var arg = arguments;
    var that = this;
    var success = url => {
        var arr = this.$data[data_name] || this.var_path_split({
            path: data_name
        }) || [];
        if (is_new && i == 0) {
            arr = [];
        }
        arr.push(url);
        this.setData({
            [data_name]: arr,
        });
        if (i < file.length - 1) {
            console.log(arguments, { ...arg[0],
                i: i + 1
            });
            this.uploadFiles({ ...arg[0],
                i: i + 1
            });
        } else {
            back_fn && back_fn(arr);
        }
    }
    // if (
    //     file[i].indexOf('http://tmp') == -1 
    //     && file[i].indexOf('http://tmp') == -1 
    //     && file[i].indexOf('wxfile://tmp') == -1
    //     ) {
    //     console.log("非本地临时文件, 下一个");
    //     success(file[i]);
    //     return;
    // }
    if (
        !file[i]

        // ||
        // file[i].indexOf(getApp().globalData.api) != -1

        ||
        file[i].search( new RegExp('^'+getApp().globalData.api)) != -1

        // ||
        // file[i].search( /^http/ ) != -1

        // && file[i].indexOf('http://tmp') == -1 
    ) {
        console.log("已上传文件, 下一个");

        // prompt('已上传文件 file[i] '+ (i + 1), file[i]);

        success(file[i]);
        return;
    }

    console.log('uploadFile', {
        url,
        filePath: file[i],
        name,
        header: {
            "Content-Type": "multipart/form-data",
            // "Content-Type": "application/json",
            'token': uni.getStorageSync('token'),
            ...header,
        },
    });
    uni.uploadFile({
        url,
        filePath: file[i],
        name,
        header: {
            // "Content-Type": "multipart/form-data",
            // "Content-Type": "multipart/form-data; boundary=------WebKitFormBoundaryA54cVlVB3pIghAN2",

            // "Content-Type": "application/json",
            'token': uni.getStorageSync('token'),
            ...header,
        },
        success: (res) => {
            console.log("上传文件 成功", (i + 1) + '/' + file.length, res);
            var res_data = JSON.parse(res.data).data;
            var url = res_data[res_name] || res_data;
            url = url.replace('http://127.0.0.1:8080/renren-fast', getUrl(''));
            url = url.replace('https://127.0.0.1:8080/renren-fast', getUrl(''));

            // prompt('上传文件 成功 file[i] '+ (i + 1), url);
        
            success(url);
        },
        fail: function(err) {
            console.log('上传文件 失败', err);
            // that.uploadFile2(arguments);
            toastTip('上传文件 失败');
        },
        // complete: function(res) {
        //     console.log('上传文件 complete', res);
        //     // prompt('uploadFile complete', JSON.stringify(err));
        // },

    })
}

// 滚动置底
function page_scroll(e) {
    console.log('页面滚动', e);
    var {
        top = uni.getSystemInfoSync().screenHeight,
    } = dataset(e);
    uni.pageScrollTo({
        duration: 0,
        scrollTop: top,
    })
}

/*
function get_glo_info(resolve)
 resolve 回调相关数据 函数/事件对象 data-back_fn
    //resolve 回调相关数据 解析
    var back_fn = undefined;
    if(resolve){
        typeof resolve == 'function'
        ?
            (back_fn = resolve)
        :
            typeof resolve == 'object' && resolve.currentTarget && resolve.currentTarget.dataset && JSON.stringify(resolve.currentTarget.dataset) != "{}" && resolve.currentTarget.dataset.bakc_fn


    }
*/
// 获取全局用户详情 需要页面this
function get_glo_info(back_fn) {
    var app = getApp();
    console.log('全局重新获取用户详情', back_fn);

    app.get_user_info(res => {
        console.log('获取用户数据成功', app.globalData.user_info);
        console.log(this);
        this.setData({
            user_info: app.globalData.user_info,
        });
        app.globalData.user_info && app.globalData.user_info.mobile && back_fn && typeof back_fn == 'function' && back_fn(
            app.globalData.user_info);
    })
    // }

}

// 相对路由 需要页面this
function relative_route() {
    console.log('相对路由');
    var arr = this.route.split('/');
    console.log(arr);
    var str = '';
    for (var i = 1; i < arr.length; i++) {
        str += '../';
    }
    console.log(str);
    this.setData({
        relative_route: str,
    })

}

// 创建dataset
function create_dataset(obj) {
    console.log('创建dataset', obj);
    return {
        currentTarget: {
            dataset: obj
        },
        detail: {
            value: obj,
        },
    };

}

// 发送请求 dataset参数 需要页面this
/*
    this.http_dataset(this.create_dataset({
        url: '',
        https_param: {}, undefined
        method: 'get',
        back_fn: res => {
            this.setData({
                navlist: res.data
            })
        }
    }))
*/
function http_dataset(e) {
    console.log('发送请求 dataset参数', e);
    var {
        url,
        https_param,
        method,
        https_then,
        https_catch,
        back_fn,
    } = dataset(e);
    https_param = { ...dataset(e),
        ...https_param
    };
    (util.https ? util.https : request)(
        url,
        https_param,
        method, ).then(res => {
        console.log('接口回调成功', res);
        typeof back_fn === 'function' && back_fn(res);
        https_then && this[https_then] && this[https_then]({ ...e,
            ...res
        });
    }).catch(res => {
        console.log('接口回调失败', res);
        https_catch && this[https_catch] && this[https_catch]({ ...e,
            ...res
        });
    });

}

// 确认对话框 catch bindtap='show_modal' data-title='title' data-content='' data-confirm='' data-cancel=''
/*
    data-show-cancel='{{false}}' data-cancel='show_modal'
    this.show_modal(this.create_dataset({
        title:'',
        contents:'',
        confirm:'',
        cancel:'show_modal',
        showCancel: false,
    }))
*/
function show_modal(e) {
    console.log('确认对话框', e);
    var obj = dataset(e);
    var content = obj.contents;
    uni.showModal({
        title: '提示',
        ...obj,
        content,
        success: res => {
            if (res.confirm) {
                console.log('用户点击确定');
                typeof obj.confirm == 'function' && obj.confirm();
                obj.confirm && this[obj.confirm] && this[obj.confirm](e);
            } else if (res.cancel) {
                console.log('用户点击取消')
                obj.cancel && this[obj.cancel] && this[obj.cancel](e);
            }
        }
    })

}

// 高德地图
// var amap = require('amap-wx');
//  获取用户当前地址_回调
function get_addr_back(location) {
    console.log('获取用户当前地址_回调', location);
}

//  获取用户当前地址
function get_addr() {
    console.log('获取用户当前地址', arguments, back_fn);
    // 高德地图
    var amap = require('../amap-wx');
    var {
        back_fn = 'get_addr_back',
            type = 'wgs84'
    } = {};
    if (['string', 'function'].indexOf(typeof arguments[0]) != -1) {
        back_fn = arguments[0];
    } else
    if (typeof arguments[0] == 'object') {
        var {
            back_fn = 'get_addr_back', type = 'wgs84'
        } = arguments[0];
    }

    // 打开授权对话框
    var show_modal = res => {
        wx.hideLoading();
        console.log('打开授权对话框', res);
        this.show_modal(
            this.create_dataset({
                title: '授权',
                contents: '登录需要获取当前定位地址， 是否授权定位地址',
                confirm: res => {
                    console.log('打开小程序设置', res);
                    wx.openSetting({
                        success: res => {
                            console.log('小程序设置 回调', res);
                            console.log(res.authSetting);
                            if (res.authSetting['scope.userLocation']) {
                                // 授权成功回调
                                getLocation();
                            }
                        }
                    })
                },
                cancel: show_modal,
            })
        );
    };

    // 授权成功回调
    var getLocation = res => {
        console.log('调用 获取用户当前地址 小程序接口, 获取当前定位');

        // wx.showLoading({
        //     title: '处理中...',
        //     mask: true,
        // });

        if (this.map_times) {
            this.map_times = 1;
        }
        this.map_times++;
        this.map_timeser && clearTimeout(this.map_timeser);
        this.map_timeser = setTimeout(res => {
            this.map_times = 0;
        }, 5000);
        if (this.map_times > 10) {
            console.log('调用次数过多');
            return
        }
        wx.getLocation({
            type,
            success: res => {
                console.log('用户授权当前地址', res);
                console.log('获取地址 成功');
                var latitude = res.latitude
                var longitude = res.longitude;
                // this.setData({
                //     latitude,
                //     longitude,
                // });
                var addr_info = {
                    latitude,
                    longitude,
                };
                // 缓存经纬度
                // wx.setStorageSync('addr_info', addr_info);
                // 逆地理编码
                amap.getRegeo({
                    location: longitude + ',' + latitude,
                    success: (res) => {
                        console.log('成功回调', res);
                        var info = res[0].regeocodeData.addressComponent;
                        addr_info = { ...res[0],
                            ...info,
                            area: info.district,
                        };
                        console.log('addr_info', addr_info);
                        // 缓存经纬度
                        back_fn || wx.setStorageSync('addr_info', addr_info);
                        //成功回调
                        wx.hideLoading();
                        back_fn && this[back_fn] && this[back_fn](addr_info);
                        back_fn && typeof back_fn == 'function' && back_fn(addr_info);
                    },
                    fail: (res) => {
                        console.log('失败回调', res);
                        wx.hideLoading();
                    }
                })


            },
            fail: res => {
                console.log('当前地址获取失败', res);

                console.log('获取小程序设置, 判断用户是否打开当前地址授权');
                wx.getSetting({
                    success: res => {
                        console.log('获取小程序设置 小程序接口调取成功', res);
                        if (res.authSetting["scope.userLocation"]) {
                            util.toastTip('请检查GPS设置是否打开');
                        } else {
                            console.log('用户拒绝授权当前地址->打开授权对话框');
                            // 打开授权对话框
                            show_modal();
                        }
                    },
                    fail: res => {
                        console.log('获取小程序设置 小程序接口调取失败', res);
                    },
                });

            },
        })
    }

    // 授权成功回调
    getLocation();
}

// 根据 经纬度 获取地址
function get_addr_info({
    latitude,
    longitude,
    back_fn,
}) {
    console.log('根据 经纬度 获取地址', {
        latitude,
        longitude
    });
    util.https('map/getAddress', {
        latitude,
        longitude
    }).then(res => {
        console.log('根据 经纬度 获取地址 接口调取成功', res);
        var title = res.data.result.formatted_addresses.recommend,
            city = res.data.result.address_component.city,
            area = res.data.result.address_component.district,
            latitude = res.data.result.location.lat,
            longitude = res.data.result.location.lng;

        var location = {
            title,
            city,
            area,
            latitude,
            longitude,
        };

        typeof back_fn === 'function' && back_fn(location);
    }).catch(e => {
        console.log('根据 经纬度 获取地址 报错', e);
    })
}

//页面加载完成函数
function onReady() {
    return
    console.log('onReady 页面初次渲染');
    var that = this;
    setTimeout(function() {
        console.log('关闭加载动画');
        that.setData({
            remind: true,
        });
    }, 800);
}

//设置全局变量
function set_glo(e) {
    console.log('设置全局变量');
    var {
        glo = {}
    } = dataset(e);

    var glos = getApp().globalData;
    for (var i in glo) {
        glos[i] = glo[i];
    }
    // console.log(glos, getApp().globalData);
}

//设置缓存
function set_stor(e) {
    console.log('设置缓存');
    var {
        name,
        value,
    } = dataset(e);
    if (!name) {
        console.log('未输入缓存名', {
            name
        });
        return;
    }
    uni.setStorageSync(name, value);
}


//判断对象属性值是否存在空
function obj_value_empty(obj) {
    console.log('判断对象属性值是否存在空');
    for (var i in obj) {
        if (obj[i] == '' || obj[i] == null || obj[i] == undefined) {
            return true;
        }
    }
    return false;
}

// 弹框事件
function popup_fn(e) {
    var {
        fn
    } = dataset(e);
    console.log('弹框事件', this, fn);
    fn && this.popup[fn](e);
}


//默认表单提交事件 
// this.submit(this.create_dataset({})) 
// 空值的属性名  this.submit_false_name
/*
    if( this.submit(this.create_dataset(obj)) ){
        // 空值的属性名  this.submit_false_name
        var name_txt = {
            "companyName": "公司名称",
        }
        // this.submit_false_name
        console.log(this.submit_false_name);
        this.toastTip('请完善 '+(name_txt[this.submit_false_name]||'信息'));
    }
*/
function submit(e) {
    console.log('默认表单提交事件', e, e.detail.value);

    var that = this;
    var form_data = e.detail.value;
    var {
        form_data_require = 'all',
    } = this.$data;

    var require_data = Array.isArray(form_data_require) ? form_data_require : form_data_require == 'all' ? Object.keys(
        form_data) : [];
    console.log(require_data);
    var require = require_data.some(item => {
        console.log(item);
        var items = form_data[item];
        var back = items === '' || (Array.isArray(items) && !items.length);
        // console.log(item, back);
        back && (this.submit_false_name = item);
        return back
    });
    console.log(require);

    if (require) {
        console.log('请完善信息');
        toastTip('请完善信息');
        // return;
        // } else if (123) {
    } else {
        console.log('信息已完善');
        // toastTip('信息已完善');
    }
    return !require;
}


// 判断授权 
function judge_auth(back_fn) {
    console.log('判断授权', back_fn)
    var auth_false = res => {
        console.log('未授权 后续执行事件');
        console.log('getCurrentPages', getCurrentPages());
        // uni.navigateTo({
        uni.redirectTo({
            url: '/pages/login/login',
            complete: res => {
                console.log('redirectTo complete', res);
                console.log('getCurrentPages complete', getCurrentPages());
                // console.log('this', this);//app
                // console.log('this.route', this.route);

            },
        })
    };
    uni.getSetting({
        success(res) {
            console.log('判断授权 返回成功', res, Page)
            if (!res.authSetting['scope.userInfo']) {
                console.log('判断授权 未授权', res)
                if (typeof back_fn === 'function') {
                    return
                }

                // 页面注册前无法跳转页面
                console.log('判断授权 未授权 判断 页面注册 是否已完成', getCurrentPages())
                if (getCurrentPages().length) {
                    console.log('判断授权 未授权  页面注册 已完成', getCurrentPages())
                    auth_false();
                } else {
                    console.log('判断授权 未授权  页面注册 未完成', getCurrentPages())
                    var timer = setInterval(res => {
                        if (getCurrentPages().length) {
                            console.log('判断授权 未授权  页面注册 已完成 清除定时器', getCurrentPages())
                            clearInterval(timer);
                            auth_false();
                        } else {
                            console.log('判断授权 未授权  页面注册 未完成 继续定时器', getCurrentPages())
                        }
                    }, 200);
                }
            } else {
                typeof back_fn === 'function' && back_fn(res);
            }
        },
    })
}

//  使用app方法
function do_app_fn(e) {
    console.log('使用app方法', e);
    var {
        fn
    } = dataset(e);
    if (fn && getApp()[fn]) {
        getApp()[fn](e);
    } else {
        console.log('为传入函数名或者无该方法', fn, getApp()[fn]);
    }
}
//  使用app多个方法
function do_app_fns(e) {
    console.log('使用app方法', e);
    do_fns.call(getApp(), e)
}



// 测试获取未使用的code
function get_codes(e) {
    console.log('测试获取未使用的code get_codes', e);
    var all_num = 10;
    var num = 0;
    var timer = setInterval(res => {
        if (num >= all_num) {
            clearInterval(timer);
            return;
        }
        num++;
        //获取登录凭证
        uni.login({
            success: res => {
                var code = res.code
                console.log('code', code);
            },
        })
    }, 10);
}


// 设置缓存
function set_stro(e) {
    console.log('设置缓存', e);
    var {
        name,
        value,
    } = dataset(e);
    if (name && value) {
        uni.setStorageSync(name, value)
    } else {
        console.log('设置缓存失败，数据缺失', {
            name,
            value,
        });
    }
}

// 使用微信的方法
function do_wx(e) {
    console.log('使用微信的方法', e);
    var {
        wx_fn,
    } = dataset(e);
    var data = dataset(e);
    if (wx_fn && uni[wx_fn]) {
        console.log('使用微信的方法 wx_fn', wx_fn, data);
        uni[wx_fn](data)
    } else {
        console.log('使用微信的方法 数据不全', {
            wx_fn
        });
    }
}



//毫数转格式 【yyyy-MM-dd】 
// alert(format(1396178344662, 'yyyy-MM-dd HH:mm:ss')); 
var format = function(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        };
    });
};


// new Date().format("yyyy-MM-dd hh:mm:ss");
///CreateDate： /date(xxxxxxxxxx)/
// var newDate = eval('new ' + CreateDate.substr(1, CreateDate.length - 2)); //new Date()
// new Date().Format("yyyy-MM-dd hh:mm:ss")
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
            k]).substr(("" + o[k]).length)));
    return fmt;
}



// 收集formID
function getFormId(ev) {
    console.log('收集formID', ev);
    let formId = ev.detail.formId;
    console.log('formId', ev.detail.formId);
    // 虚假formid，模拟器测试使用
    formId == 'the formId is a mock one' && (formId = 'cf5867a6fb5f49feb4bc442fd0eb39ea');
    /* formId被后台使用时
        返回码 说明
        40037 template_id不正确
        41028 form_id不正确，或者过期
        41029 form_id已被使用
        41030 page不正确
        45009 接口调用超过限额（目前默认每个帐号日调用限额为100万）
    */


    // POST
    // /p/formid/addFormId
    uni.https({
        url: '/p/formid/addFormId',
        method: 'POST',
        header: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: {
            formId,
        },
        success: res => {
            console.log('收集formID 接口调取成功', res);
        },
    })
}

// 打印
function console_log(...arg) {
    console.log(...arg);
}

// 表单提交
function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
    var formdata = e.detail.value
    uni.showModal({
        content: '表单数据内容：' + JSON.stringify(formdata),
        showCancel: false
    });
}

/*
    this.set_navName(this.create_dataset({title: '123'}));
*/
// 修改导航栏标题
function set_navName(e) {

    console.log('修改导航栏标题', e);
    var {
        title,
    } = dataset(e);
    uni.setNavigationBarTitle({
        title,
    });
}


// 选择相册
function choose_img(e) {

    console.log('选择相册', e, dataset(e));
    var {
        name = 'imgs',
            count = 1,
            is_new = true, //替换 逻辑为数组
    } = dataset(e);
    uni.chooseImage({
        count: count - 0, //默认9 类型number
        success: (res) => {
            console.log('从本地相册选择图片或使用相机拍照', res, JSON.stringify(res.tempFilePaths));

            res.tempFilePaths.length > count && (res.tempFilePaths.length = count);

            this.choose_img_data || (this.choose_img_data = []);

            if (!is_new) {
                // this.$data name
                var data_v = var_path_split.call(this, {
                    path: name,
                    start: this.$data
                }) || [];
                data_v.push(...res.tempFilePaths);
                this.choose_img_data = data_v;
            } else {
                this.choose_img_data = count == 1 ? res.tempFilePaths[0] : res.tempFilePaths;
                Array.isArray(this.choose_img_data) && this.choose_img_data.length > count && (this.choose_img_data.length = count);
            }
            setData.call(this, {
                [name]: this.choose_img_data,
            });
            this.choose_img_back();

        },
    })

}

// 选择相册_回调
function choose_img_back(e) {

    console.log('选择相册_回调', e);
}


// 选择_返回操作
function chose_back(obj) {
    console.log('选择_返回操作', obj);
    var pages = getCurrentPages();
    console.log('pages', pages);
    pages.pop();
    pages.pop().get_chose(...arguments);
}
// 获取_选择页返回数据
function get_chose(obj) {
    console.log('获取_选择页返回数据', obj, this.route);
}

function chooseLocation(obj) {
    console.log('打开地图选择位置', obj);
    uni.chooseLocation({
        success: function(res) {
            // prompt('chooseLocation', JSON.stringify(res));
            /*
                {
                    "name":"庆春广场[地铁站]",
                    "address":"浙江省杭州市江干区地铁2号线",
                    "latitude":30.257597,
                    "longitude":120.204748,
                    "errMsg":"chooseLocation:ok"
                }
            */
            console.log('位置名称：' + res.name);
            console.log('详细地址：' + res.address);
            console.log('纬度：' + res.latitude);
            console.log('经度：' + res.longitude);
        }
    });
}


// 判断登陆
function judge_login(e) {
    console.log('判断登陆', e);
    var judge = uni.getStorageSync('token');
    judge && this.judge_login_back && this.judge_login_back(judge);
    return judge;
}
// 判断登陆_回调
function judge_login_back(judge) {
    console.log('判断登陆_回调', judge);
}


// 多页面重复事件 - 单个项目 --------------------------------------------- 
var project_fn = {

    // sha256解密 不支持跨域
    decrypt_sha256(str) {
        console.log('sha256解密', arguments);

        uni.wjw_http({
            url: 'http://www.ttmd5.com/do.php',
            method: 'get',
            data: {
                c: 'Decode',
                m: 'getMD5',
                md5: str,
            },
            head:{
                'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
            }
        }).complete(res => {
            console.log('sha256解密 接口 请求成功', res);
            prompt('decrypt_sha256', JSON.stringify(res));
            return JSON.stringify(res);
        })

    },


    // 判断app返回功能
    back_judge_app(e) {
        console.log('判断返回', e);
        if(window&&window.Service){
            // app关闭网页
            window.Service.closeWebview();
        }else{
            wx.navigateBack()
        }
    },

    // 判断app返回功能之页面
    back_judge_app_page(e) {
        console.log('判断返回', e);
        if(getCurrentPages().length==1){
            // 判断app返回功能
            this.back_judge_app();
        }else{
            wx.navigateBack();
        }
    },



    // 第三方地图 ---------------------------------


    // 地图之获取当前位置
    map_geolocation(e, back_fn) {
        console.log('地图之获取当前位置', e);

        this.loadTip('获取当前位置中...');

        // 无法请求http链接
        // require("http://webapi.amap.com/maps?v=1.4.15&key=d4fe5543210dd8cd1152720b48732b17");

        var mapObj = new AMap.Map('iCenter');
        mapObj.plugin('AMap.Geolocation',  ()=> {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();

            //返回定位信息
            AMap.event.addListener(geolocation, 'complete', res=>{
                console.log('地图之获取当前位置 返回定位信息', res);
                /*
                    {
                        accuracy: null,
                        // info: "SUCCESS",
                        isConverted: true,
                        location_type: "ip",
                        message: "Get geolocation time out.Get ipLocation success.Get address fail,check your key or network.",
                        position: {
                            P: 30.29872,
                            Q: 120.28604999999999,
                            lat: 30.29872,
                            lng: 120.28605,
                        },
                        qDa: "jsonp_372350_",
                        status: 1,
                        type: "complete",
                    }
                */
                var latitude = res.position.lat;
                var longitude = res.position.lng;
                var location = latitude+','+longitude;
                this.location=location;
                this.longitude=longitude;
                this.latitude=latitude;
                var obj = {
                    location,
                    longitude,
                    latitude,
                }
                wx.setStorageSync('addr', obj);

                // 地图之逆地理编码
                this.map_georegeo_regeo(this.create_dataset(obj), addr_info=>{

                    wx.setStorageSync('addr', addr_info);

                    this.toastTip('当前位置获取完毕');

                    // 地图之获取当前位置_回调
                    this.map_geolocation_back && this.map_geolocation_back(addr_info);
                    typeof back_fn === 'function' && back_fn(addr_info);
                }) 

            });
            //返回定位出错信息
            AMap.event.addListener(geolocation, 'error', res=>{

                console.log('地图之获取当前位置 返回定位出错信息', res);
                // prompt('地图之获取当前位置 返回定位出错信息 res', JSON.stringify(res));
                // {"type":"error","message":"Geolocation permission denied.","info":"FAILED","status":0}

                this.toastTip('当前位置获取 失败');

                return;

                var str = '定位失败,';
                str += '错误信息：'
                switch(res.info) {
                    case 'PERMISSION_DENIED':
                        str += '浏览器阻止了定位操作';
                        break;
                    case 'POSITION_UNAVAILBLE':
                        str += '无法获得当前位置';
                        break;
                    case 'TIMEOUT':
                        str += '定位超时';
                        break;
                    default:
                        // str += '未知错误';
                        str += '当前位置获取 失败';
                        break;
                }
                console.log('地图之获取当前位置 定位失败 str ', str);
                this.toastTip(str);

            });      
        });

    },
    // 地图之获取当前位置_回调
    map_geolocation_back(addr_info) {
        console.log('地图之获取当前位置_回调', addr_info);
    },

    // 地图之IP定位 待完善
    map_getaddr_ip(e) {
        console.log('地图之IP定位', e);

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/ip',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                // ip: '',
            },
        }).then(res => {
            console.log('地图之IP定位 接口 请求成功', res);

            // 地图之IP定位_回调
            this.map_getaddr_ip_back && this.map_getaddr_ip_back();
            
        })

    },
    // 地图之IP定位_回调
    map_getaddr_ip_back(e) {
        console.log('地图之IP定位_回调', e);
    },


    // 地图之逆地理编码
    map_georegeo_regeo(e, back_fn) {
        console.log('地图之逆地理编码', back_fn);
        
        var {
            longitude = this.longitude,
            latitude = this.latitude,
        }= this.dataset(e);

        if( !(longitude&&latitude) ){
            console.log('请传入经纬度', longitude, latitude);
            this.toastTip('请传入经纬度');
            return;
        }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/geocode/regeo',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                // 经度在前，纬度在后，经纬度间以“,”分割
                location: longitude+','+latitude
            },
        }).then(res => {
            console.log('地图之逆地理编码 接口 请求成功', res);
            // prompt('地图之逆地理编码', JSON.stringify(res));
            /* res
                {
                    "status": "1",
                    "regeocode": {
                        "addressComponent": {
                            "country": "中国",
                            "province": "北京市",
                            "city": [],
                            "district": "朝阳区",
                            "township": "望京街道",
                            "adcode": "110105",
                            "towncode": "110105026000",
                            "streetNumber": {
                                "number": "6号",
                                "location": "116.482005,39.9900561",
                                "direction": "东南",
                                "distance": "63.2126",
                                "street": "阜通东大街"
                            },
                            "country": "中国",
                            "township": "望京街道",
                            "businessAreas": [
                                "0": {
                                    "location": "116.470293,39.996171",
                                    "name": "望京",
                                    "id": "110105"
                                },
                                "1": {
                                    "location": "116.494356,39.971563",
                                    "name": "酒仙桥",
                                    "id": "110105"
                                },
                                "2": {
                                    "location": "116.492891,39.981321",
                                    "name": "大山子",
                                    "id": "110105"
                                }
                            ],
                            "building": {
                                "name": "方恒国际中心B座",
                                "type": "商务住宅;楼宇;商务写字楼"
                            },
                            "neighborhood": {
                                "name": "方恒国际中心",
                                "type": "商务住宅;楼宇;商住两用楼宇"
                            },
                            "citycode": "010"
                        },
                        "formatted_address": "北京市朝阳区望京街道方恒国际中心B座方恒国际中心"
                    },
                    "info": "OK",
                    "infocode": "10000"
                }
            */
            // this.nav_list = res.regeocode;
            var add_info = res.regeocode.addressComponent;
            
            add_info.province = add_info.province.replace(/市$/, '省');
            if(! ( add_info.city&& typeof add_info.city == 'string') ){
                add_info.city = add_info.province.replace(/省$/, '市');
            }
            
            add_info.formatted_address = res.regeocode.formatted_address;


            add_info.street_txt = add_info.streetNumber.street+add_info.streetNumber.number;
            add_info.abbr = add_info.formatted_address.slice(
                add_info.formatted_address.indexOf(add_info.township)+add_info.township.length 
            );

            
            add_info.full_name =
            add_info.full_name1 = add_info.formatted_address.replace(
                new RegExp(add_info.township+'.*'), 
                add_info.street_txt
            );
            add_info.full_name2 = add_info.formatted_address;

            add_info.longitude = longitude;
            add_info.latitude = latitude;

            
            console.log('add_info', add_info);
            
            wx.setStorageSync('addr', add_info);
            // console.log("wx.getStorageSync('addr')", wx.getStorageSync('addr'));
            
            this.addr = add_info;

            // 地图之逆地理编码_回调
            this.map_georegeo_regeo_back && this.map_georegeo_regeo_back(add_info);
            typeof back_fn === 'function' && back_fn(add_info);
            
        })
    },
    // 地图之逆地理编码_回调
    map_georegeo_regeo_back(add_info) {
        console.log('地图之逆地理编码_回调', add_info);
    },
           
    // 地图之周边搜索
    map_around(e) {
        console.log('地图之周边搜索', e);
        
        var addr = wx.getStorageSync('addr')||{};
        var {
            longitude = this.longitude||addr.longitude,
            latitude = this.latitude||addr.latitude,
            keywords = '',
            radius = '',
            sortrule = '',
            city = '',
        }= this.dataset(e);

        if( !(longitude&&latitude) ){
            console.log('请传入经纬度', longitude, latitude);
            this.toastTip('请传入经纬度');
            return;
        }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/place/around',
            method: 'get',
            data: {
                ...this.dataset(e),
                key: getApp().globalData.map_key,
                // 经度在前，纬度在后，经纬度间以“,”分割
                location: longitude+','+latitude,
                keywords,
                radius,//查询半径 默认值3000 取值范围:0-50000。规则：大于50000按默认值，单位：米
                sortrule,//排序规则 默认值distance 规定返回结果的排序规则。 按距离排序：distance；综合排序：weight
                city,
            },
        }).then(res => {
            console.log('地图之周边搜索 接口 请求成功', res);
            // prompt('地图之周边搜索', JSON.stringify(res));
            /* res
                {
                    "status":"1",
                    "count":"858",
                    "info":"OK",
                    "infocode":"10000",
                    "suggestion":{
                        "keywords":[],
                        "cities":[]
                    },
                    "pois":[
                        {
                            "id":"B0FFGXP3OZ",
                            "location":"116.481285,39.990321",

                            "name":"王光发托运部",
                            "type":"生活服务;物流速递;物流速递",
                            "address":"阜通东大街6-2号楼附近",

                            "pname":"北京市",
                            "cityname":"北京市",
                            "adname":"朝阳区",

                            "parent":[],
                            "childtype":[],
                            "typecode":"070500",
                            "biz_type":[],
                            "tel":[],
                            "distance":"23",
                            "biz_ext":{
                                "rating":[],
                                "cost":[]
                            },
                            "importance":[],
                            "shopid":[],
                            "shopinfo":"0",
                            "poiweight":[],
                            "photos":[]
                        }
                    ]
                }
            */
            
            var pois = res.pois;
            this.pois = pois;

            // 地图之周边搜索_回调
            this.map_around_back && this.map_around_back(pois);
            
        })

    },
    // 地图之周边搜索_回调
    map_around_back(pois) {
        console.log('地图之周边搜索_回调', pois);
    },
           
    // 地图之关键字搜索
    map_search_keywords(e) {
        console.log('地图之关键字搜索', e);
        
        var {
            keywords=this.keywords,
            city=(wx.getStorageSync('addr')||{}).city,
            citylimit,
        }= this.dataset(e);

        // &&city
        if( !(keywords) ){
            console.log('请传入搜索关键字 keywords', keywords);
            this.toastTip('请传入搜索关键字');
            return;
        }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/place/text',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                keywords,
                city,
                citylimit,
            },
        }).then(res => {
            console.log('地图之关键字搜索 接口 请求成功', res);
            // prompt('地图之关键字搜索', JSON.stringify(res));
            /* res
                {
                    "status":"1",
                    "count":"858",
                    "info":"OK",
                    "infocode":"10000",
                    "suggestion":{
                        "keywords":[],
                        "cities":[]
                    },
                    "pois":[
                        {
                            "id":"B0FFGXP3OZ",
                            "location":"116.481285,39.990321",

                            "name":"王光发托运部",
                            "type":"生活服务;物流速递;物流速递",
                            "address":"阜通东大街6-2号楼附近",

                            "pname":"北京市",
                            "cityname":"北京市",
                            "adname":"朝阳区",

                            "parent":[],
                            "childtype":[],
                            "typecode":"070500",
                            "biz_type":[],
                            "tel":[],
                            "distance":"23",
                            "biz_ext":{
                                "rating":[],
                                "cost":[]
                            },
                            "importance":[],
                            "shopid":[],
                            "shopinfo":"0",
                            "poiweight":[],
                            "photos":[]
                        }
                    ]
                }
            */
            
            var pois = res.pois;
            this.pois = pois;

            // 地图之关键字搜索_回调
            this.map_search_keywords_back && this.map_search_keywords_back(pois);
            
        })

    },
    // 地图之关键字搜索_回调
    map_search_keywords_back(pois) {
        console.log('地图之关键字搜索_回调', pois);
    },
           
    // 地图之行政区域查询
    map_district(e) {
        console.log('地图之行政区域查询', e);
        
        var {
            keywords = this.map_district_keywords,
        }= this.dataset(e);
        console.log('地图之行政区域查询 keywords', keywords);

        // if( !(longitude&&latitude) ){
        //     console.log('请传入经纬度', longitude, latitude);
        //     this.toastTip('请传入经纬度');
        //     return;
        // }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/config/district',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                // 经度在前，纬度在后，经纬度间以“,”分割
                keywords,
            },
        }).then(res => {
            console.log('地图之行政区域查询 接口 请求成功', res);
            // prompt('地图之行政区域查询', JSON.stringify(res));
            /* res
                {
                    "status":"1",
                    "info":"OK",
                    "infocode":"10000",
                    "count":"1",
                    "suggestion":{},
                    "districts":[
                        {
                            "citycode":[],
                            "adcode":"370000",
                            "name":"山东省",
                            "center":"117.000923,36.675807",
                            "level":"province",
                            "districts":[]
                        }
                    ]
                }
            */
            
            var location = res.districts[0].center;
            var longitude=location.split(',')[0];
            var latitude=location.split(',')[1];
            this.location=location;
            this.longitude=longitude;
            this.latitude=latitude;
            var obj = {
                location,
                longitude,
                latitude,
            }

            // 地图之行政区域查询_回调
            this.map_district_back && this.map_district_back(obj);
            
        })

    },
    // 地图之行政区域查询_回调
    map_district_back(obj) {
        console.log('地图之行政区域查询_回调', obj);
    },
           
    // 地图之行政区域查询城市
    map_district_city(e) {
        console.log('地图之行政区域查询城市', e);
        
        var {
            city = this.city,
        }= this.dataset(e);
        console.log('地图之行政区域查询城市 city', city);

        // if( !(longitude&&latitude) ){
        //     console.log('请传入经纬度', longitude, latitude);
        //     this.toastTip('请传入经纬度');
        //     return;
        // }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/config/district',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                // 经度在前，纬度在后，经纬度间以“,”分割
                keywords: city,
            },
        }).then(res => {
            console.log('地图之行政区域查询城市 接口 请求成功', res);
            // prompt('地图之行政区域查询城市', JSON.stringify(res));
            /* res
                {
                    "status":"1",
                    "info":"OK",
                    "infocode":"10000",
                    "count":"1",
                    "suggestion":{},
                    "districts":[
                        {
                            "citycode":"0483",
                            "adcode":"152900",
                            "name":"阿拉善盟",
                            "center":"105.706422,38.844814",
                            "level":"city",
                            "districts":[]
                        }
                    ]
                }
            */

            var city_info = res.districts.find(item=>item.level=='city')||{};
            
            var location = city_info.center;
            var longitude=location.split(',')[0];
            var latitude=location.split(',')[1];
            this.location=location;
            this.longitude=longitude;
            this.latitude=latitude;
            var obj = {
                location,
                longitude,
                latitude,
                city,
            }

            // 地图之行政区域查询城市_回调
            this.map_district_city_back && this.map_district_city_back(obj);
            
        })

    },
    // 地图之行政区域查询城市_回调
    map_district_city_back(obj) {
        console.log('地图之行政区域查询城市_回调', obj);
    },
           
    // 地图之地理编码
    map_geocode_geo(e) {
        console.log('地图之地理编码', e);
        
        var {
            address = this.address||'',
            city = this.city||'',
        }= this.dataset(e);
        console.log('地图之地理编码 address', address);
        console.log('地图之地理编码 city', city);

        // &&city
        if( !(address) ){ 
            console.log('请传入 结构化地址信息', address);
            return;
        }

        uni.wjw_http({
            url: 'http://restapi.amap.com/v3/geocode/geo',
            method: 'get',
            data: {
                key: getApp().globalData.map_key,
                address: address,
                city: city,
            },
        }).then(res => {
            console.log('地图之地理编码 接口 请求成功', res);
            // prompt('地图之地理编码', JSON.stringify(res));
            /* res
                {
                    "status": "1",
                    "info": "OK",
                    "infocode": "10000",
                    "count": "1",
                    "geocodes": [
                        "0": {
                            "formatted_address": "四川省阿坝藏族羌族自治州",
                            "country": "中国",
                            "province": "四川省",
                            "citycode": "0837",
                            "city": "阿坝藏族羌族自治州",
                            "district": [],
                            "township": [],
                            "neighborhood": {…},
                            "building": {…},
                            "adcode": "513200",
                            "street": [],
                            "number": [],
                            "location": "102.224653,31.899413",
                            "level": "市"
                        }
                    ]
                }
            */
            
            var location = res.geocodes[0].location;
            var longitude=location.split(',')[0];
            var latitude=location.split(',')[1];
            this.location=location;
            this.longitude=longitude;
            this.latitude=latitude;
            var obj = {
                location,
                longitude,
                latitude,
            }

            // 地图之地理编码_回调
            this.map_geocode_geo_back && this.map_geocode_geo_back(obj);
            
        })

    },
    // 地图之地理编码_回调
    map_geocode_geo_back(obj) {
        console.log('地图之地理编码_回调', obj);
    },


    // 第三方地图 -end ---------------------------------


    
    // 获取用户信息 
    get_member_info(e) {
        console.log('获取用户信息', e);

        uni.wjw_http({
            url: '/app/tmember/info',
            method: 'get',
        }).then(res => {
            console.log('获取用户信息 接口 请求成功', res);
            /*
                createTime: "2019-12-04 16:12:58"
                loginToken: "loginToken"
                memberId: 208
                memberName: "15868382139"
                password: "加密"
                phone: "15868382139"
                state: 0
                stateStr: "正常"
                uniqueId: "191204187"
                updateTime: "2019-12-04 16:12:58"
                whetherAdmin: 2
                whetherAdminStr: "是"
            */
            var mine = res.data||{};
            this.mine = mine;
            if(mine.phone=='15868382139'){
                wx.setStorageSync('test', true);
            }
        })

    },

    // 获取用户信息 
    get_info_byid(e) {
        console.log('获取用户信息', e);

        var id;
        if(['string', 'number'].indexOf(typeof e) !=-1){
            id=e;
        }
        if(typeof e =='object'){
            id = this.dataset(e).id;
        }
        if(this.is_test){
            // prompt('获取用户信息 this.get_info_byid id', JSON.stringify(id||this.id||this.memberId));
        }
        uni.wjw_http({
            url: '/app/tmember/infoByMemberId',
            method: 'get',
            data: {
                memberId: id||this.id||this.memberId,
            }
        }).then(res => {
            console.log('获取用户信息 接口 请求成功', res);
            if(this.is_test){
                // prompt('获取用户信息 接口 请求成功 res', JSON.stringify(res));
            }
            /*
                createTime: "2019-12-04 16:12:58"
                loginToken: "loginToken"
                memberId: 208
                memberName: "15868382139"
                password: "加密"
                phone: "15868382139"
                state: 0
                stateStr: "正常"
                uniqueId: "191204187"
                updateTime: "2019-12-04 16:12:58"
                whetherAdmin: 2
                whetherAdminStr: "是"
            */
            this.now_company = uni.getStorageSync('company')||{};
            // this.staff = res.data;
            this.staff = Object.assign(this.staff || {}, res.data);

            if (!this.staff.companyName) {
                this.staff.companyId = this.now_company.companyId
                this.staff.companyName = this.now_company.companyName
            }
            if(this.is_test){
                // prompt('获取用户信息 接口 请求成功 this.now_company', JSON.stringify(this.now_company));
                // prompt('获取用户信息 接口 请求成功 this.staff', JSON.stringify(this.staff));
            }

            // 获取用户信息_回调
            this.get_info_byid_back && this.get_info_byid_back(this.staff);

            // this.decrypt_sha256(this.staff.password);
        })

    },
    // 获取用户信息_回调
    get_info_byid_back(e) {
        console.log('获取用户信息_回调', e);
    },


    //获取公司列表
    get_companys(e) {
        console.log('获取公司列表', e);

        uni.wjw_http({
            url: '/app/tcompany/list',
            method: 'get',
        }).then(res => {
            console.log('获取公司列表 接口 请求成功', res);
            /*
                {
                    companyId: 1,
                    companyName: '杭州彼信信息科技有限公司',
                    reviewStatus: 0, // 审核状态 0:提交审核1:审核通过 -1:审核不通过
                },
            */
            this.companys = res.data;
            this.firms = this.companys.filter(item => item.reviewStatus == 1 && (item.value = item.companyName, true));

            this.get_companys_back && this.get_companys_back();
        })

    },
    // 获取公司列表_回调 
    get_companys_back(e) {
        console.log('获取公司列表_回调', e);
    },

    //获取保险公司列表
    get_insurance_companys(e) {
        console.log('获取保险公司列表', e);

        uni.wjw_http({
            url: '/app/tinsurancecompany/list',
            method: 'get',
        }).then(res => {
            console.log('获取保险公司列表 接口 请求成功', res);
            /*
                {
                    insuranceCompanyId 保险公司id
                    insuranceCompanyName 保险公司名称
                },
            */
            this.insurance_companys = res.data;

            this.get_insurance_companys_back && this.get_insurance_companys_back();
        })

    },
    // 获取保险公司列表_回调 
    get_insurance_companys_back(e) {
        console.log('获取保险公司列表_回调', e);
    },

    set_storage_company(company) {
        console.log('缓存当前公司', company);
        uni.setStorageSync('company', company);
    },


            
    // 获取消息类型列表 
    get_news_listType(e) {
        console.log('获取消息类型列表', e);
        
        uni.wjw_http({
            url:'/app/tmessage/listType',
            method:'get',
        }).then(res=>{
            console.log('获取消息类型列表 接口 请求成功', res);
            /*
                count   未读数量
                messageContent 消息内容
                messageType 消息类型 1:系统消息2:订单消息
                messageTypeStr 消息类型Str

            */
            
            var news_listType = res.data||[];
            this.news_listType = news_listType;

            // 获取消息类型列表_回调
            this.get_news_listType_back && this.get_news_listType_back(news_listType);
        })
    
    },

    // 获取消息类型列表_回调
    get_news_listType_back(e) {
        console.log('获取消息类型列表_回调', e);

    },

    // 获取消息列表 
    get_news_list(messageType = 1) {
        console.log('获取消息列表', messageType);

        // messageType 消息类型 1:系统消息2:订单消息 非必填
        uni.wjw_http({
            url: '/app/tmessage/list',
            method: 'get',
            data: { messageType },
        }).then(res => {
            console.log('获取消息列表 接口 请求成功', res);
            /*
               {
                "createTime": "",
                "haveRead": 0,// 是否已读 1:未读2:已读
                "messageContent": "",// 消息内容
                "messageId": 0,
                "messageReceiver": 0,
                "messageType": 0,
                "messageTypeRemark": "",
                "state": 0,
                "updateTime": ""
               }
            */
            this.news_list = res.data || [];
            // this[messageType==1?'system_news':'order_news']=res.data;
            var ids = this.news_list.map(item => item.messageId);

            // 读取消息
            this.read_news(this.create_dataset({
                id: ids,
            }));
        })

    },

    // 读取消息 
    read_news(e) {
        console.log('读取消息', e);

        var { id = '' } = this.dataset(e);

        // messageIds 消息id,支持多个 示例(1,2,3) 读取消息,如果消息id为空就是读取消息,如果传入消息id就是读取传入id的
        uni.wjw_http({
            url: '/app/tmessage/read',
            method: 'post',
            data: { messageIds: id }
        }).then(res => {
            console.log('读取消息 接口 请求成功', res);

            // 读取消息_回调
            this.read_news_back && this.read_news_back();
        })

    },
    // 读取消息_回调
    read_news_back(e) {
        console.log('读取消息_回调', e);

    },



    // 获取员工列表   需要添加公司  获取公司id  公司切换后获取公司id
    get_staff_list(e) {
        console.log('获取员工列表', e, this.companyId, uni.getStorageSync('company'));

        uni.wjw_http({
            url: '/app/tmember/employeeList',
            method: 'get',
            data: {
                companyId: this.companyId || uni.getStorageSync('company').companyId, // 公司id 当登录人为管理员时需要传入公司id
            }
        }).then(res => {
            console.log('获取员工列表 接口 请求成功', res);
            /* 
                memberId: 209
                memberName: "13735370601"
                whetherAdmin: 2 // 是否管理员 1:不是 2:是
                whetherAdminStr: "是"
                
                
                id: 2,
                name: '李四',
                admin: '',
                company: '',
                insure: '',
            */
            this.staff_list = res.data;
            this.get_staff_list_back && this.get_staff_list_back();

        })

    },
    // 获取员工列表_回调 
    get_staff_list_back(e) {
        console.log('获取员工列表_回调', e);
    },





};


// 多页面重复事件 - 单个项目 -edn --------------------------------------------- 



module.exports = {

    cu_nav, // colorui 自定义导航栏获取系统信息


    isJSON, // 判断字符串是否为json格式

    setData,
    set_pages, // 页面名称简化 用于app.js

    var_path_split, // 变量路径拆分 需要页面this
    dataset, // 设置自定义参数 需要事件event

    getUrl, // 判断请求网站, 是否添加前缀;  getUrl(url);
    delayJump, // 延迟跳转
    buildRequest, // 网络请求 对象参数
    request, // 网络请求 一对一参数
    toastTip, // 提示信息
    loadTip, // 提示加载信息
    get_list, // 获取列表, 依赖1.request函数; 2.toastTip函数 需要页面this

    login_check, // 登录检测
    jump, // 页面跳转, 依赖1.request函数; 2.login_check函数

    random, // 随机范围
    color_random, // 随机色, 依赖random函数

    is_email, // 验证邮箱
    is_phone, // 验证手机号
    is_zh_CN, // 验证中文
    isCardNo, // 验证身份证号码

    call, // 拨打电话 需要页面this

    preview_img, // 在新页面中全屏预览图片

    img_err, // 图片加载失败 需要页面this
    img_load, // 图片加载

    trigger, // 切换布尔值 需要页面this

    input_set_value, // 输入框修改属性 需要页面this
    picker_set_value, // picker修改属性 需要页面this

    set_value, // 设置属性值 需要页面this

    count_value, // 增减属性值 需要页面this

    event_false, // 阻止事件冒泡
    stop_swiper, // 禁止滑动

    showToast, // 显示提示
    show_modal, // 确认对话框

    do_fns, // 执行多个方法 需要页面this

    uploadFiles, // 上传文件 递归调用 需要页面this

    page_scroll, // 滚动置底

    get_glo_info, // 获取全局用户详情 需要页面this

    relative_route, // 相对路由 需要页面this

    create_dataset, // 创建dataset

    http_dataset, // 发送请求 dataset参数 需要页面this

    get_addr, // 获取地址
    get_addr_back, // 获取用户当前地址_回调

    get_addr_info, // 根据 经纬度 获取地址

    onReady, //页面加载完成函数

    set_glo, //设置全局变量
    set_stor, // 设置缓存

    obj_value_empty, //判断对象属性值是否存在空

    popup_fn, // 弹框事件

    submit, // 默认表单提交事件

    judge_auth, // 判断授权

    do_app_fn, // 使用app方法
    do_app_fns, // 使用app多个方法


    get_codes, // 测试获取未使用的code

    set_stro, // 设置缓存

    do_wx, // 使用微信的方法

    getFormId, // 收集formID


    console_log, // 打印
    formSubmit, //表单提交
    set_navName, // 修改导航栏标题
    choose_img, // 选择相册
    choose_img_back, // 选择相册_回调

    chose_back, // 选择_返回操作
    get_chose, // 获取_选择页返回数据

    chooseLocation, // 打开地图选择位置

    judge_login, // 判断登陆

    judge_login_back, // 判断登陆_回调

    format,    // 毫数转格式

    ...project_fn,


}