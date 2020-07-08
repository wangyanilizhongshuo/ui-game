
//添加complete：便于网络请求的complete方法。
console.log("Promise.complete", Promise.complete);
Promise.prototype.complete = function(callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};
console.log("Promise.complete", Promise.complete);

//封装异步api
const wxPromisify = fn => {
    return function(obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function(res) {
                resolve(res)
            }

            obj.fail = function(res) {
                reject(res)
            }

            fn(obj)
        })
    }
}

const getLocationPromisified = wxPromisify(wx.getLocation); //获取经纬度
const showModalPromisified = wxPromisify(wx.showModal); //弹窗


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

// 判断地址头是否是服务器地址
function judge_url_pre(url){
    console.log('判断地址头 是否 是服务器地址', url);
    url += '';
    // return 1;
    var url_pre = '';
    var result = '';

    url_pre = getApp().globalData.api.replace(/^(http|https):/, '');;
    result = url.search( new RegExp('^(http|https):'+url_pre)) != -1;
    // console.log('判断地址头 是否 是服务器地址 result', result);
    return result;

    // if(
    //     window
    //     && window.location
    //     && window.location.protocol
    //     && ['http:', 'https:'].indexOf(window.location.protocol)!=-1
    // ){
    //     url_pre = getApp().globalData.api.replace(/^(http|https):/, window.location.protocol);
    //     return url.search( new RegExp('^'+url_pre)) != -1;
    // }
}

// token失效
function token_false(res){
    console.log('token失效', res);
    /*
        res.data.msg
        // token失效
        "msg":"token不存在,请重新登录",
        // token不存在
        "msg":"token不能为空",
    */
    console.log('token不存在或失效',res.data.code, res.data.msg);
    wx.clearStorageSync();
    
    wx.showToast({
        // title: wx.getStorageSync('token')?'登录失效，请重新登录':'未登录，请先登录',
        title: res.data.msg,
        icon: 'none', 
    });
    setTimeout(res=>{
        if(window&&window.Service){
            window.Service.loginOut();
            return
        }
        wx.reLaunch({
            url:'/pages/login/login',
        });
    }, 1500);
}

// method 必须大写，有效值在不同平台差异说明不同。
const https = ({ type = 'POST',method = type, url = '', data = {},param = data, isDebug = false, isLoad = false, header={}, } = {}) => {
	// method 必须大写，有效值在不同平台差异说明不同。
	method = method.toUpperCase()
    if (isLoad) {
        wx.showLoading({
            title: '请求中...'
        });
    }
    let timeStart = Date.now();

    var const_data={};
    var const_header={};
    if(judge_url_pre(getUrl(url))){

        const_data.token = wx.getStorageSync('token');

        const_header.token = wx.getStorageSync('token');
        const_header['content-type'] = "application/x-www-form-urlencoded";
    }
    console.log('const_data', const_data);
    console.log('const_header', const_header);
    return new Promise((resolve, reject) => {
        // arguments与透参函数的问题------------------
        // console.log(arguments);
        setTimeout(res=>{
            wx.request({
                url: getUrl(url),
                data: {
                    ...const_data,
                    ...param,
                },
                method: method,
                header: {
                    // 'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"

                    // 'content-type': 'application/x-www-form-urlencoded', 
                    // 'token': wx.getStorageSync('token'),

                    // 'content-type': judge_url_pre(getUrl(url))?'application/x-www-form-urlencoded':"application/json", 
                    // token: judge_url_pre(getUrl(url))?wx.getStorageSync('token'):'',

                    'content-type': 'application/json', 

                    ...const_header,

                    ...header,
                },
                complete(res){
                    console.log('http  complete res',res);
                    // prompt('wx.request res', JSON.stringify(res));
                    // var pages = getCurrentPages();
    				
					if(judge_url_pre(getUrl(url))){
    				    
                        // 本地 --------------------------------------------
            				// prompt('token'+wx.getStorageSync('token'), JSON.stringify(res));
                            /*
                                {"errMsg":"request:fail"}
                            */
                            // 针对 非app内嵌h5 即浏览器h5
                        if(window&&window.location&&window.location.hostname=='localhost'){
                            console.log('本地', window.location.hostname);
                            // wx.getStorageSync('token') &&
                            if(res.errMsg=="request:fail" ){
                                // token失效
                                token_false({
                                    ...res, 
                                    data:{
                                        code: '自定义code',
                                        msg: 'token失效',
                                    },
                                });
                                reject(res);
                            }
                        }

                        // 本地 -end --------------------------------------------

        				// return
                        /* 异地登录 token
                            alert(JSON.stringify(res));
                            prompt('token'+wx.getStorageSync('token'), JSON.stringify(res));
                            {
                                "statusCode":200,
                                "data":{
        							// token失效
                                    "msg":"token不存在,请重新登录",
        							// token不存在
                                    "msg":"token不能为空",
                                    "code":500
                                },
                                "header":{
                                    "date":"Thu, 05 Dec 2019 04:31:59 GMT",
                                    "server":"nginx/1.15.6",
                                    "connection":"keep-alive",
                                    "transfer-encoding":"chunked",
                                    "content-type":"application/json;charset=UTF-8"
                                },
                                "errMsg":"request:ok"
                            }
                        */

                        switch (res.statusCode) {
                            case 400:
                                // 无效参数
                                console.log('无效参数');
                                // toastTip(res.data.msg);
                                break;
                            case 401:
                                console.log('未授权', res.data.code);
                                switch (res.data.code) {
                                    case 10001:
                                        console.log('token已过期或无效, 获取token或加入重新加载列');
                                        // toastTip('请刷新或重新进入当前页面');
                                        getApp().globalData.resolve.push({
                                            method,
                                            url,
                                            param,
                                            resolve,
                                            isDebug,
                                            isLoad,
                                        });

                                        // 获取服务器返回的token
                                        getApp().get_token();
                                        return;
                                        break;
                                    case 10002:
                                        console.log('未绑定手机号, 无权访问');
                                        getApp().globalData.accounts_back.push({
                                            method,
                                            url,
                                            param,
                                            resolve,
                                            isDebug,
                                            isLoad,
                                        });
                                        wx.navigateTo({
                                            url: "/" + getApp().globalData.page_data.pages.common_accounts,
                                        })
                                        return;
                                        break;
                                    default:
                                        break;
                                }
                            case 500:
                                // 服务器错误
                                console.log('服务器错误, 暂不处理');
                                break;
                            default:
                                break;
                        }
    					
					
						
					}

                    if (isLoad) {
                        wx.hideLoading()
                    }
                    if (isDebug) {
                        console.log(`耗时${Date.now() - timeStart}`);
                        console.log(res.data)
                    }
                    
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        // resolve(res)
                        // resolve(res.data)
						

                        if(!judge_url_pre(getUrl(url)) ){
                            
                            resolve(res.data)
                            return;
                            
                        }
    					// &&res.data
                        if (res.data.code==500&&res.data.msg&&res.data.msg.indexOf('token')!=-1) {
    						
                            // token失效
                            token_false(res);
                            reject(res);
                        } else 
    					if (res.data.code==0) {
    					    resolve(res.data)
    					} else {
    						res.data.msg && wx.showToast({
    						    title: res.data.msg,
    							icon: 'none', 
    						});
    					    reject(res)
    					}

                    } else {
                        reject(res)
                    }
                }
            })
        }, wx.getStorageSync('token')?0:1000);
    })
}


// 延迟跳转
function delayJump(url = '/pages/index/index', duration = 1000, type = 1) {
    setTimeout(function() {
        switch (type) {
            case 1:
                wx.navigateTo({
                    url: url
                })
                break;
            case 2:
                wx.redirectTo({
                    url: url
                })
                break;
            case 3:
                wx.switchTab({
                    url: url
                })
                break;
            default:
                break;
        }
    }, duration)
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

// 拨打电话
function call(e) {
    console.log('拨打电话', e);
    var {
        phone = e.currentTarget.dataset.phone
    } = this.data;

    // 转化为字符串
    phone +='';
    
    console.log(phone);
    wx.makePhoneCall({
        phoneNumber: phone
    })
}

// 在新页面中全屏预览图片 绑定事件 元素自定义属性(data-) ( imgs(图片数组)与index(当前图片下标) ) 或者 img(当前图片)
function preview_img(e) {
    console.log('在新页面中全屏预览图片', e);

    var { index, imgs, img } = e.currentTarget.dataset;
    console.log({ index, imgs, img });
    wx.previewImage({
        current: img||imgs[index], // 当前显示图片的http链接
        urls: imgs||[img], // 需要预览的图片http链接列表
        success: res => {
            console.log('预览图片 小程序接口调取成功', res);
            util.toastTip('长按出现“保存图片”选项', undefined, 1500);
        },
    })
}

module.exports = {
    https,
    getLocationPromisified,
    showModalPromisified,
    
    delayJump,

    is_phone, // 验证手机号
    is_zh_CN, // 验证中文
    isCardNo, // 验证身份证号码
    call,// 拨打电话
    preview_img,// 在新页面中全屏预览图片
}