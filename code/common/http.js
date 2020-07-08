console.log('http.js console.log');

// 判断请求网站, 是否添加前缀;  getUrl(url);
// getUrl: 
function getUrl(url){
    var http_pre = 
        window.http || 
        window.api || 
        window.http_pre || 
        (window.getApp&&window.getApp()&&window.getApp().globalData&&window.getApp().globalData.api) 
        || location.origin 
        || ''
    ;
    // http_pre && (http_pre.replace(/(?<!\/)$/, '/'));
    // http_pre.replace(/[?<!/]$/, '/');//?<!/
    http_pre && (http_pre.replace(/(?!\/)$/, '/'));

    console.log('判断请求网站, 是否添加前缀', url, url.indexOf('://') == -1, http_pre);
    if (url.indexOf('://') == -1) {
        // console.log('this.$scope', this.$scope);
        // console.log('getApp()', getApp());
        url = http_pre + url;
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
        // console.log('判断请求网站, 是否添加前缀 判断当前协议 http_pre', http_pre);
        url=url.replace(/^(http|https):/, window.location.protocol);
    }
    return url
}


// 将所有 loading Toast 设置为背景不可点击 (2.2.10 版本开始支持)
vant  && vant.Toast &&  vant.Toast.setDefaultOptions('loading', { forbidClick: true });

// 允许同时存在多个 Toast
vant  && vant.Toast &&  vant.Toast.allowMultiple();

var clear_time = 300; // 接口回调 清除加载提示的 延迟时间 ms
clear_time=0;


// var wjw_http = 
// function (){
function wjw_http(obj){
    obj||(obj={})
    var type=(obj&&obj.type);
        ((type==undefined)||(type==null))&&(type='GET');
    var dataType=(obj&&obj.dataType);
        ((dataType==undefined)||(dataType==null))&&(dataType='json');
    var url=(obj&&obj.url);
        ((url==undefined)||(url==null))&&(url='');
    var data=(obj&&obj.data);
        ((data==undefined)||(data==null))&&(data={});
    var param=(obj&&obj.param);
        ((param==undefined)||(param==null))&&(param=data);
    var xhrFields=(obj&&obj.xhrFields);
        ((xhrFields==undefined)||(xhrFields==null))&&(xhrFields={});
    var crossDomain=(obj&&obj.crossDomain);
        ((crossDomain==undefined)||(crossDomain==null))&&(crossDomain=true);
    var before_fn=(obj&&obj.before_fn);
    var success=(obj&&obj.success);
    var fail=(obj&&obj.fail);
    var loading=(obj&&obj.loading);
        ((loading==undefined)||(loading==null))&&(loading=true);
// function wjw_http(
//     {
//         type='GET',
//         dataType='json',
//         url='',
//         data={},
//         param=data,
//         xhrFields={},
//         crossDomain=true,
//         before_fn,
//         success,
//         fail,
//         loading=true,
//         // that,
//     }={}
// ){

    // console.log('二次封装 接口函数', wjw_http);
    // console.log('this.user_token', this.user_token);
    // console.log('this.user_token||(window.vue&&window.vue.user_token)', this.user_token||(window.vue&&window.vue.user_token));


    // test_mode = 1;// 页面对应自己的js中设置 静态测试模式 待完善, 部分已完善 -----------------
    if(window.test_mode||(window.vue&&window.vue.test_mode) ){
        console.log('二次封装 接口函数 静态测试模式', window.test_mode, window.vue, window.vue.test_mode );
        return
    }
    console.log('二次封装 接口函数 执行' );

    before_fn&&before_fn();


    /* 加载提示
        Toast.loading() 方法      展示加载提示
        forbidClick属性           禁用背景点击，
        通过loadingType属性       自定义加载图标类型。
        duration                 展示时长(ms)，值为 0 时，toast 不会消失  number  2000


        // 将所有 loading Toast 设置为背景不可点击 (2.2.10 版本开始支持)
        Toast.setDefaultOptions('loading', { forbidClick: true });


        // 圆圈图标
        Toast.loading({
          message: '加载中...',
          forbidClick: true
        });

        // 线组成的圆圈图标
        // 自定义加载图标
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner'
        });



        Toast.allowMultiple() 允许同时存在多个 Toast

        单例模式
            Toast 默认采用单例模式，
                即同一时间只会存在一个 Toast，
                如果需要在同一时间弹出多个 Toast，
                可以参考下面的示例

                    Toast.allowMultiple();

                    const toast1 = Toast('第一个 Toast');
                    const toast2 = Toast.success('第二个 Toast');

                    toast1.clear();
                    toast2.clear();


    */
    // 自定义加载图标
    var toast = loading && vant && vant.Toast && vant.Toast.loading({
      message:          '加载中...',
      // forbidClick:      true,
      loadingType:      'spinner',
      duration:         0,
    });

    
    var that = this||{};
    console.log('http.js this',this)
    xhrFields = Object.assign({
        withCredentials: true,
    }, xhrFields)
    param = Object.assign({
        api_token: create_api_token(),
        user_token: that.user_token||(window.vue&&window.vue.user_token),
        token: that.user_token||(window.vue&&window.vue.user_token),
    }, param)

    var ajax_param = {

        xhrFields: xhrFields,

        dataType: dataType,
        crossDomain: crossDomain,

        type: type,
        url: getUrl(url),

        // data:{
        //     api_token: create_api_token(),
        //     user_token: that.user_token||(window.vue&&window.vue.user_token),
        //     ...param,
        // },
        data:param,

        // 报错手机数据
        wjw_err_param: {
            'new Date().getTime()': new Date().getTime(),
            'time_stamp': window.time_stamp,
            'time_stamp_start': window.time_stamp_start,
            'time_page_start': window.time_page_start,
        },

    };
    var ajax_fn = {

        success:
            function(res) {
                console.log('接口调取 成功', res);

                setTimeout(function(res){
                    // 手动清除 Toast
                    toast&&toast.clear();
                }, clear_time);
                    

                /* 接口返回code码说明：
                        0成功，1失败，2登录过期，3账号被冻结，4服务器维护，9无接口访问权限（2，3，4踢出用户至登录页）

                    {
                        "code": 0,
                        "message": "注册成功",
                        "data": {}
                    }
                */
                switch(res.code){
                    case 2:
                        console.log('登录过期', res);
                        // APP跳转登录页
                        
                        window.app_fn && window.app_fn({name:'loginOut', param: ''});

                        break;
                    case 4:
                        console.log('服务器维护', res);
                        // APP跳转登录页
                        
                        setTimeout(function(res){
                            window.app_fn && window.app_fn({name:'loginOut', param: '4'});
                        }, 1000);

                        break;
                    case 9:
                        break;
                    default:
                        break;
                }


                if(res.code==0){
                    console.log('接口返回 成功', res);
                    // vant.Toast('接口 调取成功');
                    success&&success(res);


                }else{
                    // fail||vant.Toast(res.message||'code不为0即成功状态');
                    res.message&& vant && vant.Toast && vant.Toast(res.message);
                    fail&&fail(res, ajax_param);
                }

            },
    };

    var ajax_obj = {};
    Object.assign(ajax_obj, 
        ajax_param,
        ajax_fn
    );

    $.ajax(
        ajax_obj
    ).fail(function(res) {
        console.log('接口调取 失败', res);

        setTimeout(function(res){
            // 手动清除 Toast
            toast && toast.clear();
        }, clear_time);

        vant && vant.Toast && vant.Toast('接口调取 失败');
        // fail||vant.Toast('接口调取 失败');
        fail&&fail(res, ajax_param);
    });
}