/* 待修改-----------
    手机号11位
    验证码6位数字
    密码6-20位
    所有输入操作 去掉空格
*/

/**
    获取页面 GET 方式请求的参数
    根据变量名获取匹配值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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

var apply_param = getQueryString('apply')||'client';
var http_pre = get_config()[apply_param].url;
var api = http_pre+'/';

var client_id = client_id||get_config()[apply_param].client_id;
var client_secret = client_secret||get_config()[apply_param].client_secret;
// api_token: create_api_token(),

var vm = vue = new Vue({
    el: '#Vue',
    data: function() {
        return {

            show_type: 'register_form_show',// 显示的类型
            // true false
            // register_form_show: false, // 注册页面 显示
            // register_ok_show: true, // 注册成功页面 显示
            // app_down_show: true, // 下载app 显示
            // login_form_show: true, // 登录表 显示

            register_form: 'register.html',
            register_ok_page: 'register.html?types=register_ok',
            app_down_page: 'register.html?types=app_down',
            login_page: 'register.html?types=login',
            forget_password_page: 'register.html?types=forget_password',
            login_after_page: 'game.html',
            login_bonus_push_after_page: 'bonus_push.html',



            
            app_down_url_iOS: '',
            app_down_url_Android: '',
            market_app_down_url_iOS: '',
            market_app_down_url_Android: '',

            popup_show: false, // 弹出消息显示


            // verify_click: true, // 验证码可点击
            verify_times: 60, // 验证码倒计时最大数
            verify_time: 0, // 验证码倒计时

            form_click: false, // 表单可点击
            
            // tel 是   string  手机号
            // password    是   string  密码（6-20个字符）
            // code    否   string  验证码（新人注册必传）
            // inviter 是   string  邀请码
            tel: '',
            code: '',
            password: '',
            password2: '',
            inviter: '',


            login_tel: '',
            login_password: '',
            user_token: '',

            forget_tel: '',
            forget_verify_time: '',
            forget_password: '',
            forget_password2: '',
            forget_code: '',


            
            login_bonus_push_tel: '',
            login_bonus_push_password: '',
        }
    },
    watch: {
        // h5移动端 typenumber 监听不到字符和空格输入 --------------------------------------------------
        tel:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('code watch', arguments, this);

                // alert('watch tel:'+this.tel)

                var val = this.$options.filters.remove_space(arguments[0]);


                this.tel=val.replace(/[^0-9]/g,'');

                // alert('tel:'+this.tel)

                this.tel.length>11&&(this.tel=this.tel.substr(0,11)
                    // , this.Toast('手机号码最多可输入11位')
                )
            },
        },
        code:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('code watch', arguments, this);
                var val = this.$options.filters.remove_space(arguments[0]);

                // 不会循环
                // if(val==arguments[0]){
                //     return
                // }

                this.code=val;
                this.code.length>6&&(this.code=this.code.substr(0,6), this.Toast('验证码最多可输入6位'))
            },
        },
        password:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('password watch', arguments, this);
                this.password = this.$options.filters.remove_space(arguments[0]);
                this.password.length>20&&(this.password=this.password.substr(0,20), this.Toast('密码最多可输入20位'))
            },
        },
        password2:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('password2 watch', arguments, this);
                this.password2 = this.$options.filters.remove_space(arguments[0]);
                this.password2.length>20&&(this.password2=this.password2.substr(0,20), this.Toast('密码最多可输入20位'))
            },
        },
        login_bonus_push_tel:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('code watch', arguments, this);

                // alert('watch login_bonus_push_tel:'+this.login_bonus_push_tel)

                var val = this.$options.filters.remove_space(arguments[0]);


                this.login_bonus_push_tel=val.replace(/[^0-9]/g,'');

                // alert('login_bonus_push_tel:'+this.login_bonus_push_tel)

                this.login_bonus_push_tel.length>11&&(this.login_bonus_push_tel=this.login_bonus_push_tel.substr(0,11)
                    // , this.Toast('手机号码最多可输入11位')
                )
            },
        },
        login_bonus_push_password:{
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {
                console.log('login_bonus_push_password watch', arguments, this);
                this.login_bonus_push_password = this.$options.filters.remove_space(arguments[0]);
                this.login_bonus_push_password.length>20&&
                (this.login_bonus_push_password=this.login_bonus_push_password.substr(0,20)
                    // , this.Toast('密码最多可输入20位')
                )
            },
        },

        show_type: {
            immediate: true,  //刷新加载 立马触发一次handler
            handler: function(newValue, oldValue) {

                console.log('切换显示的类型 show_type', this.show_type);
                if(this.show_type == 'login_bonus_push_show'){
                    window.document.title='链麦乐分红塔';
                }
            },
        },
        
    },
    filters: {
        // 去除所有空格
        remove_space: function (value) {
            console.log('去除所有空格 arguments', arguments);
            // console.log('去除所有空格 this', this);
            // console.log('去除所有空格 value', value);
            // console.log('去除所有空格 value.replace(/ /g, "")', value.replace(/ /g, ''));
            return value.replace(/ /g, '');
        },
    },
    created: function(e) {
        console.log('实例创建完成后 created', arguments);

        /*
            show_type: 'register_form_show',// 显示的类型
            // true false
            // register_form_show: false, // 注册页面 显示
            // register_ok_show: true, // 注册成功页面 显示
            // app_down_show: true, // 下载app 显示
            // login_form_show: true, // 登录表 显示
        */
        switch(getQueryString('types')){
            case 'app_down': 
                console.log('切换显示的类型 show_type app_down', getQueryString('types'));
                this.show_type = 'app_down_show';

                // 下载地址
                this.uploadUrl();

                break;
            case 'register_ok': 
                console.log('切换显示的类型 show_type register_ok', getQueryString('types'));
                this.show_type = 'register_ok_show';

                // 下载地址
                this.uploadUrl();
                
                break;
            // case 'login': 
            //     console.log('切换显示的类型 show_type login', getQueryString('types'));
            //     this.show_type = 'login_form_show';
            //     break;
            case 'login_bonus_push': 
                console.log('切换显示的类型 show_type login login_bonus_push', getQueryString('types'));
                this.show_type = 'login_bonus_push_show';
                break;
            case 'forget_password': 
                console.log('切换显示的类型 show_type forget_password', getQueryString('types'));
                this.show_type = 'forget_password_form_show';
                break;

            default: 
                console.log('切换显示的类型 show_type ', getQueryString('types'));
                this.show_type = 'register_form_show';
                this.inviter = getQueryString('tel');
                // if(!this.inviter){
                //     vant.Toast('邀请码不可为空，非手填');
                // }
                break;
        }
    },
    methods: {
        /*
        // 设置自定义参数
        dataset: function(e) {

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
        },
        */

        // 创建dataset
        create_dataset: function create_dataset(obj) {
            console.log('创建dataset', obj);
            return {
                currentTarget: {
                    dataset: obj
                },
                detail: {
                    value: obj,
                },
            };

        },

        
        // 页面跳转
        jump: function(e) {
            console.log('页面跳转jump', e.currentTarget.dataset);

            var obj = e.currentTarget.dataset;

            var fixed_param_arr = ['url']; //固定参数数组
            // var {
            //     url,
            //     time = 0,
            //     type,
            //     check,
            //     phone_check,
            // } = obj;
            var url = obj.url;
            if (!url) {
                console.log('无跳转页面', url);
                return
            }
            var param = '?'; //存储拼接的参数
            for (var i in obj) {
                if (fixed_param_arr.indexOf(i) != -1) {
                    continue
                }

                if (param != '?') {
                    param += '&'
                }
                // param += `${i}=${obj[i]}`;
                param += (i+'='+obj[i]);
            }
            if (param == '?') {
                param = '';
            }
            // window.location.href = '/goods/detail?id=' + id;
            // window.location.href = 'detail.html?id=' + id;
            window.location.href = url + param;
        },

        // console_log: function(...arg) {
        //     console.log(...arg);
        // },

        // 提示
        Toast: function(text) {
            console.log('提示', text);
            vant.Toast(text);
        },


        // 接口模板
        mode: function(e) {
            console.log('接口模板', e);
            
            // var that = this;
            // $.ajax({
            //     type: 'POST',
            //     url: api+'enter/register',// （仅注册使用）
            //     dataType: 'json',
            //     data:{
            //         api_token: create_api_token(),
            //         user_token: this.user_token,
            //         // tel 是   string  手机号
            //         // password    是   string  密码（6-20个字符）
            //         // code    否   string  验证码（新人注册必传）
            //         // inviter 是   string  邀请码
            //         tel: this.tel,
            //         password: this.password,
            //         code: this.code,
            //         inviter: this.inviter,
            //     },
            //     xhrFields: {withCredentials: true},
            //     crossDomain: true,
            //     success:
            //         function(res) {
            //             console.log('注册接口返回', res);

            //             /* 接口返回code码说明：
            //                     0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

            //                 {
            //                     "code": 0,
            //                     "message": "注册成功",
            //                     "data": {}
            //                 }
            //             */
            //             if(res.code==0){
            //                 vant.Toast('注册成功');
            //                 that.show_type="register_ok_show";
            //             }else{
            //                 vant.Toast(res.message||'注册失败');
            //             }

            //         },
            // }).fail(function(res) {
            //     console.log('注册失败', res);
            //     vant.Toast('注册失败');
            // });

            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'enter/register',
                data:{
                    tel: this.tel,
                },
                success: function(res) {
                    console.log('注册 接口返回 成功', res);
                    vant.Toast('注册成功');
                    that.show_type="register_ok_show";

                },
                fail: function(res) {
                    console.log('注册失败', res);
                    vant.Toast(res.message||'注册失败');
                },
            })
        },


        // 发送验证码
        send_verify: function(e) {
            console.log('send_verify 发送验证码', e);

            // if(!is_phone(this.tel)){
            //     this.Toast('手机号格式错误');
            //     return
            // }
            
            // verify_time: 0, // 验证码倒计时
            if(this.verify_time>0){
                console.log('验证码倒计时中', this.verify_time);
                return
            }


            // 静态效果 ------------------------------------
            // return
            // 静态效果 -end ------------------------------------

            
            // this.loadTip('发送验证码中...');

            var that = this;
            wjw_http({
                type:'POST',
                url:'popularize/sendCode',
                data:{
                    tel: this.tel,
                    inviter: this.inviter,
                },
                success:
                    function(res) {
                        console.log('发送验证码', res);

                        /* 接口返回code码说明：
                                0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                            {
                                "code": 0,
                                "message": "发送成功",
                                "data": {}
                            }
                        */
                        vant.Toast(res.message||'发送成功');
                        that.verify_timer&&clearInterval(that.verify_timer);
                        that.verify_time = that.verify_times;
                        that.verify_timer = setInterval(function() {
                            that.verify_time--;
                            if(that.verify_time<=0){
                                that.verify_time=0;
                                clearInterval(that.verify_timer);
                            }
                        }, 1000);
                        // that.form_click=true;

                    },
                fail: function(res) {
                    console.log('发送验证码 失败', res);
                    vant.Toast(res.message||'发送验证码 失败');
                },
            })
            
        },

        // 注册信息验证
        confirm_sub_check: function(e) {
            console.log('注册信息验证', e);
            if(this.tel&&this.code&&this.password&&this.password2&&this.password==this.password2&&this.inviter){
                vant.Toast('注册信息验证 通过');
            }else{

                if(!(this.inviter)){
                    vant.Toast('注册信息验证 邀请码 未通过');
                    return
                }

                if(!(this.tel&&this.tel.length==11)){
                    vant.Toast('注册信息验证 手机号码 未通过');
                    return
                }

                if(!(this.code)){
                    vant.Toast('注册信息验证 验证码 未通过');
                    return
                }

                if(!(this.password)){
                    vant.Toast('注册信息验证 设置密码 未通过');
                    return
                }

                if(!(this.password2)){
                    vant.Toast('注册信息验证 确认密码 未通过');
                    return
                }

                if(!(this.password==this.password2)){
                    vant.Toast('注册信息验证 设置密码与确认密码 不一致');
                    return
                }
            }
        },
        
        // 注册
        confirm_sub: function(e) {
            console.log('注册', e);
            
            // if(!is_phone(this.tel)){
            //     this.Toast('手机号格式错误');
            //     return
            // }

            // 静态效果 ------------------------------------
            // alert('暂未开通');
            // this.popup_show = true;
            // return;
            // 静态效果 -end ------------------------------------

            // this.loadTip('注册中...');
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'popularize/register',
                data:{
                    // tel 是   string  手机号
                    // password    是   string  密码（6-20个字符）
                    // code    否   string  验证码（新人注册必传）
                    // inviter 是   string  邀请码
                    tel: this.tel,
                    password: this.password,
                    code: this.code,
                    inviter: this.inviter,
                },
                success: 
                    function(res) {
                        console.log('注册接口返回', res);

                        /* 接口返回code码说明：
                                0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                            {
                                "code": 0,
                                "message": "注册成功",
                                "data": {}
                            }
                        */
                            vant.Toast(res.message||'注册成功');
                            that.show_type="register_ok_show";

                            // 下载地址
                            that.uploadUrl();
                    },
                fail: function(res) {
                    console.log('注册失败', res);

                    vant.Toast(res.message||'注册 失败');

                },
            });
        
        },
        

        // 登录
        login_sub: function(e) {
            console.log('登录', e);
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'enter/login',
                data:{
                    api_token: create_api_token({
                        client_id: this.app.client_id,
                        client_secret: this.app.client_secret,
                    }),
                    tel: this.login_tel,
                    password: this.login_password,
                    // equipment_code: '123',// 设备码
                    // equipment_code: CryptoJS.MD5(`tel=${vue.login_tel}&sign=123`).toString().substring(8,24).toLowerCase(),// 设备码
                    equipment_code: CryptoJS.MD5('tel='+vue.login_tel+'&sign=123').toString().substring(8,24).toLowerCase(),// 设备码
                    equipment_remarks: '122',// 设备描述
                    
                    /* equipment_code 加密规则参考接口加密规则，
                        加密密钥为传入的md5(password)16位小写（8-24），
                        加密字符串为tel=15538125992&sign=674D9CFE-3F5B-4D7B-BB6F-97B2505ADB86
                    */
                },
                success: 
                    function(res) {
                        console.log('登录接口返回', res);

                        /* 接口返回code码说明：
                                0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                            {
                                "code": 0,
                                "message": "登录成功",
                                "data": {
                                    "user_token": "6bc1dd5eba0"
                                }
                            }
                        */
                            vant.Toast(res.message||'登录成功');
                            that.user_token = res.data.user_token;
                            // console.log('user_token', that.user_token);
                            // prompt('user_token', JSON.stringify(that.user_token));

                            that.jump(that.create_dataset({
                                url: that.login_after_page,
                                user_token: that.user_token,
                            }))

                    },
                fail: function(res) {
                    console.log('登录失败', res);
                    vant.Toast(res.message||'登录失败');
                },
            })
        
        },

            

        // 登录_分紅塔
        login_bonus_push_sub: function(e) {
            console.log('登录_分紅塔', e);

            // if(this.login_bonus_push_password&&this.login_bonus_push_password.length<6){
            //     vant.Toast('密码6-20位');
            //     return
            // }
            
            if(!(this.login_bonus_push_tel&&this.login_bonus_push_tel.length==11)){
                vant.Toast('手机号格式不正确');
                return
            }

            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'enter/loginByWeb',
                data:{
                    api_token: create_api_token({
                        client_id: get_config()['active'].client_id,
                        client_secret: get_config()['active'].client_secret,
                    }),
                    tel: this.login_bonus_push_tel,
                    password: this.login_bonus_push_password,
                },
                success: 
                    function(res) {
                        console.log('登录接口返回', res);

                        /* 接口返回：
                            {
                                "code": 0,
                                "message": "登录成功",
                                "data": {
                                    "token": "76ba0047d1bf434dd2996ced0c2ff2fd662b5e4f506d1b32aa6db9528e4c056771b87eb5a193870a8a0870df325f1aa5318484834345afc0217e322a561466bbb22240c186ade863f1c5ef8d32ada950"
                                }
                            }
                        */
                            vant.Toast(res.message||'登录成功');

                            that.jump(that.create_dataset({
                                url: that.login_bonus_push_after_page,
                                // user_token: res.data.token,
                            }))
                            document.cookie="user_token="+res.data.token;  
                            // document.cookie=res.data.token;  
                            

                    },
                fail: function(res) {
                    console.log('登录失败', res);
                    vant.Toast(res.message||'登录失败');
                },
            })
        
        },

        
        // 下载地址
        uploadUrl: function(e) {
            console.log('下载地址', e);
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'popularize/uploadUrl',
                data:{
                },
                success: function(res) {
                    console.log('下载地址 接口返回', res);

                    /* 接口返回code码说明：
                            0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                        {
                            "code": 0,
                            "message": "获取成功",
                            "data": {
                                "android_upload_url": "https://www.baidu.com",
                                "ios_upload_url": "https://www.baidu.com"
                            }
                        }
                    */
                    // vant.Toast(res.message||'下载地址 成功');
                    that.app_down_url_iOS=res.data.ios_upload_url;
                    that.app_down_url_Android=res.data.android_upload_url ;

                },
                fail: function(res) {
                    console.log('下载地址 失败', res);
                    vant.Toast(res.message||'下载地址 失败');
                },
            });
            wjw_http({
                type:'get',
                url:get_config()['market'].url+'/'+'textcontent/address',
                data:{
                    api_token: create_api_token('market'),
                },
                success: function(res) {
                    console.log('下载地址 接口返回', res);

                    /* 接口返回code码说明：
                            0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                        {
                            "code": 0,
                            "message": "获取成功",
                            "data": {
                                android: "http://mupload.iu-tech.cn/iUtoken_1.0.1.apk"
                                ios: "https://im22.me/yu0z"
                            }
                        }
                    */
                    // vant.Toast(res.message||'下载地址 成功');
                    that.market_app_down_url_iOS=res.data.ios;
                    that.market_app_down_url_Android=res.data.android ;

                },
                fail: function(res) {
                    console.log('下载地址 失败', res);
                    vant.Toast(res.message||'下载地址 失败');
                },
            });
        
        },


    },
})