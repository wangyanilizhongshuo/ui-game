

console.log('game.js console.log');
// alert('game.js?87');
// vant.Toast('game.js?321');

/* 待修改 -------------------------------
    // 1.农场界面 接口 与 好友主页 接口 合并;

    // 2.计时器拆分与监听; 
        // 保护罩       倒计时     已拆分, 单独 vue.data 内的属性 控制
        // 能源/水晶    倒计时     未拆分, 数组下 的属性 控制
        // 未实现 计算属性和侦听器 面对 数组问题

    // 3.ios fixed固定定位 问题; 
        // 原因:app自定义导航栏;  
        // 解决: 页面底部添加容器抵消

    4.去我的好友基地时可以继续跳转其他好友基地, 
        a.判断是否是同一个好友;
        b.返回我的基地,跳过所有好友基地;
            思路一: 替换当前页:
                我的基地去好友基地时用正常跳转(页面会添加到历史记录);
                好友基地去好友基地时用替换当前页或js切换数据(页面不会额外添加到历史记录),
                此时返回我的基地按钮只需要返回上一页即可;
            思路二: 添加url参数, 用于判断返回我的基地的页面数量;

    待测试 -------------------------------
    // 1.ios 页面下拉刷新 会不会 冒泡手机的下拉; 
        // 无影响, ios手机的下拉 跟 页面下拉刷新 不冲突

*/

/*
    ios 固定头
    iPhoneX之后 88px 
        页面校对: 73px
    iPhoneX之前 64px
*/



var apply_param = getQueryString('apply')||'client';
var http_pre = get_config()[apply_param].url;

var api = http_pre+'/';

var client_id = get_config()['game'].client_id;
var client_secret = get_config()['game'].client_secret;
// api_token: create_api_token(),
// user_token = 6bc18c93512cdb9d09ecbbf7ececb55e23757f452d6a10f84afb21f6a917ef383125b23c83ef37ca64711b122d98805534950ee699b53b10376a3d7cce4fe5ba7cb41e14293b607acdbd26875a9decd42c085be8e385df8df6eb9345bdd5eba0



// type 是   int 1学员2代理  页面设置默认为1
// document.title = getQueryString('type') == 2 ? '代理信息' : '学员信息';

// var test_mode = false;// 静态数据模式 改用 vue.data

// 测试token
var user_token_test = 
'76ba0047d1bf434dd2996ced0c2ff2fd7ed8bd3d89c40265fb68bd5c436e35fe6646fd6fd47f7e56d3f8ad58224c1c1c38969edc3b5035564d453b70299f49357ffeab532c6ff95e03598594296daeff50864eb84a6edb52e484895c5068db04'
;

var nickname = 
    getQueryString('nickname')
    ||
    getQueryString('alert_txt')
    ||
    ''
;
try{
    nickname=decodeURIComponent(escape(nickname));
}catch(e){
    nickname=nickname;
}
var vm ;
var vue ;
vm = vue = new Vue({
    el: '#Vue',
    data: function() {
        var that = this;
        return {

            Vue_show: true,// vue加载完成, 显示vue内容

            is_ios:  !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            userAgent: navigator.userAgent,
            ios_nav_occupy: window.screen.height >= 812?"73px":"64px",


            page_refreshing: false,// 页面刷新状态



            // 测试相关 -end -------------------------------------------------

            test_mode: false,// 静态数据模式
            test_account: false,// 开启测试账号

            page_scale: true,// 页面内容拉伸
            btns_inner: false,// 按钮不超出页面内容

            page_refresh_close: true,// 关闭页面下拉刷新
            refresh_close: true,// 关闭所有下拉刷新


            controller_btn_show: false, // 控制器按钮显示
            controller_show: false, // 控制器显示
            js_edition: '', // 控制器显示
            controll_list: [
                // 
                {
                    show: true,
                    name: '刷新',// 标题title/名字name
                    label: '',// 描述信息
                    icon: 'replay',// 图标
                    'is-link': false,// 显示箭头 ['is-link']/is_link/isLink
                    url: '',// 页面导航 url/to
                    // fn: '',// 点击执行事件
                    fn: function(){
                        history.go(0) 
                    },

                    is_switch: '',// 设置为滑块功能
                    switch_name: '',// 滑块对应属性名
                    switch_value: '',// 滑块对应值
                    switch_value_fn: '',// 滑块对应值获取函数
                    switch_fn: '',// 滑块切换事件
                },
                {
                    show: true,
                    name: '当前js版本 js_edition',
                    label: function(){
                        return that.js_edition;
                    },
                },
                {
                    show: true,
                    name: '打开公告栏',
                    is_switch: true,
                    switch_value_fn: function(){
                        return that&&that.$refs&&that.$refs.notice&&that.$refs.notice.showNoticeBar;
                    },
                    switch_fn: function(){
                        that.$refs.notice.showNoticeBar = !that.$refs.notice.showNoticeBar;
                        // vue.$refs.notice.showNoticeBar = true;
                    },
                },
                {
                    show: true,
                    name: '当前user_token',
                    label: function(){
                        return that.user_token;
                    },
                    is_input: true,
                    input_name: 'user_token',
                },
                {
                    show: true,
                    name: '静态数据模式',
                    is_switch: true,
                    switch_name: 'test_mode',
                },
                {
                    show: true,
                    name: '开启测试账号',
                    // label: '注意使用下拉刷新',
                    is_switch: true,
                    switch_name: 'test_account',
                },
                {
                    show: true,
                    name: '关闭页面下拉刷新',
                    is_switch: true,
                    switch_name: 'page_refresh_close',
                },
                {
                    show: true,
                    name: '关闭所有下拉刷新',
                    label: '优先级大于 关闭页面下拉刷新',
                    is_switch: true,
                    switch_name: 'refresh_close',
                },
                {
                    show: true,
                    name: '按钮不超出页面内容',
                    is_switch: true,
                    switch_name: 'btns_inner',
                },
                {
                    show: true,
                    name: '页面内容拉伸',
                    is_switch: true,
                    switch_name: 'page_scale',
                },
                {
                    show: true,
                    name: '场景切换 白天',
                    is_switch: true,
                    switch_name: 'bg_index',
                    switch_fn: function(boolean){
                        console.log('滑块切换事件', boolean, this);
                        that.bg_index = boolean-0;
                    },
                },
                {
                    show: true,
                    name: '保护罩',
                    is_switch: true,
                    switch_name: 'protect_status',
                    switch_fn: function(boolean){
                        console.log('滑块切换事件', boolean, this);

                        // protect_status: '',//保护罩状态0不存在1存在
                        // protect_surplus_time: '',// 保护罩剩余时间-秒数
                        // protect_surplus_times: '',// 保护罩剩余时间-显示内容

                        that.protect_status = boolean-0;
                        that.protect_surplus_time = boolean?'100':'';
                        // this.protect_surplus_times = boolean?'01:40':'';
                    },
                },
                {
                    show: true,
                    name: '背景使用长图',
                    is_switch: true,
                    switch_value_fn: function(){
                        // bgs
                        // bgs_first
                        // bgs_long
                        return JSON.stringify(that.bgs)==JSON.stringify(that.bgs_long);
                    },
                    switch_fn: function(boolean){
                        console.log('滑块切换事件', boolean, this);
                        that.bgs = boolean?that.bgs_long:that.bgs_first;
                    },
                },

                {
                    show: true,
                    name: 'is_ios',
                    is_switch: true,
                    switch_name: 'is_ios',
                },
                {
                    
                    show: function(){
                        return that.is_ios;
                    },
                    name: 'userAgent: ',
                    label: JSON.stringify(navigator.userAgent),
                },
                {
                    show: function(){
                        return that.is_ios;
                    },
                    name: ' ios_nav_occupy 是=>73px 否=>64px',
                    label: 'ios_nav_occupy 抵消ios导航栏占据高度  (在页面底部添加相同高度)',
                    is_switch: true,
                    switch_value_fn: function(){
                        return that.ios_nav_occupy=='73px';
                    },
                    switch_fn: function(boolean){
                        console.log('滑块切换事件', boolean, this);
                        that.ios_nav_occupy = boolean?'73px':'64px';
                    },
                },
                {
                    
                    show: function(){
                        return that.is_ios;
                    },
                    name: 'ios_nav_occupy 增加',
                    label: function(){
                        return that.ios_nav_occupy;
                    },
                    fn: function(){
                        that.ios_nav_occupy=parseInt(that.ios_nav_occupy)+1+'px';
                    },
                },
                {
                    show: function(){
                        return that.is_ios;
                    },
                    name: 'ios_nav_occupy 减少',
                    label: function(){
                        return that.ios_nav_occupy;
                    },
                    fn: function(){
                        that.ios_nav_occupy=parseInt(that.ios_nav_occupy)-1+'px';
                    },
                },

                {
                    show: true,
                    name: '测试网页',
                    icon: '//webh5.wangjiangwei.top/favicon.ico',
                    url: '//webh5.wangjiangwei.top',
                },


                {
                    show: true,
                    name: '行高与高度对比',
                    is_switch: true,
                    switch_name: 'lh_show',
                },
                {
                    show: true,
                    name: '对照尺寸',
                    is_switch: true,
                    switch_name: 'contrast_show',
                },
                {
                    show: true,
                    name: '测量高度',
                    is_switch: true,
                    switch_name: 'contrast_height_show',
                },
                {
                    show: true,
                    name: '测量宽度',
                    is_switch: true,
                    switch_name: 'contrast_width_show',
                },

            ],

            lh_show: false,// 行高与高度对比

            // 对照尺寸
            contrast_show: false,
            contrast_height_show: false,
            contrast_height: 10,
            contrast_width_show: false,
            contrast_width: 10,


            // 测试相关 -end -------------------------------------------------


            user_token: getQueryString('user_token')
            // ||window.user_token_test
            ||''
            ,


            username: getQueryString('username')
            ||''
            ,
            // 好友手机号


            nickname: 
                nickname
                ||'好友'
            ,
            // 好友手机号

            show_type: '',// 显示的类型 friend 好友基地



            // 背景图
            bgs: [
                // 'img/game/changjing1.png',
                // 'img/game/changjing2.png',

                'img/game/changjing1.jpg',
                'img/game/changjing2.jpg',

                // 'img/game/changjing1_lw.jpg',
                // 'img/game/changjing2.jpg',

                // 'img/game/changjing1_long.jpg',
                // 'img/game/changjing2_long.jpg',
            ],
            bgs_first: [
                'img/game/changjing1.jpg',
                'img/game/changjing2.jpg',
            ],
            bgs_long: [
                'img/game/changjing1_long.jpg',
                'img/game/changjing2_long.jpg',
            ],
            bg_index: 0,



            protect_status: '',//保护罩状态0不存在1存在
            protect_surplus_time: '',// 保护罩剩余时间-秒数
            protect_surplus_times: '',// 保护罩剩余时间-显示内容



            // 
            /* 晶石 英文翻译
                水晶 => crystal => 晶体;水晶 
                晶石 => Spar => 桅杆 
                晶石 => barite => 重晶石
                魔晶 => Magic Crystal
            */
            holding_id: '',//当前操作能源id
            crystal_glow_an: 3,// 光晕效果 1 缩放 2 明暗 3 缩放+明暗
            crystals_show: false, // 能源信息
            crystals_index: 0, // 能源信息下标
            crystals: [
                // 
                /*
                    {
                        show: true,// 显示当前水晶
                        deblocking: true,// 是否已解锁
                        place: true,// 是否已放置水晶


                        scatter: false,// 是否散装

                        // 整体图片
                        imgs: [
                            'img/game/jingshi7.png',
                            'img/game/suijingshi7.png',
                        ],
                        // 改成由 small_show属性 决定下标 
                        // img_index: 1, 

                        // 散装 -----------------------------------

                        crystal: 'img/game/mojing7.png',// 晶石
                        crystal_and_glow_an: true,// 晶石动画

                        small: 'img/game/xiaojingshi7.png',// 晶石之带小晶石
                        small_show: false,// 显示小水晶
                        crystal_small_an: true,// 小水晶动画

                        own_an: true,// 动画独立, 取否时, 开启晶石动画 则 关闭小水晶动画, 小水晶跟随
                        // 散装 -end -----------------------------------

                        // 光源
                        glows: [
                            'img/game/glow1/guangyuan1-7.png',
                            'img/game/glow2/guangyuan1-7.png',
                        ],
                        glow_index: 1,
                        glow_show: true,// 显示光源

                        position: {
                            //px 100vw=375px 空值不写入页面, 0值会写入页面(可固定宽高解决)
                            left: 92.5,
                            right: '',
                            top: 60.5,
                            bottom: '',
                        },
                        // time: '9:36:16',// 倒计时
                        time: '36:16',// 倒计时
                    },
                */
                // {
                //     No: 99,//福利能源
                //     show: false,

                //     deblocking: false,// 是否已解锁
                //     place: false,// 是否已放置水晶

                //     scatter: false,

                //     imgs: [
                //         'img/game/gattai.png',
                //         'img/game/gattai2.png',
                //     ],

                //     crystal: 'img/game/gattai.png',
                //     crystal_and_glow_an: false,

                //     small: 'img/game/kakera_b.png',
                //     small_show: false,
                //     crystal_small_an: false,

                //     own_an: false,

                //     glows: [
                //         'img/game/glow1/guangyuanf1-3.png',
                //         'img/game/glow2/guangyuanf1-3.png',
                //     ],
                //     glow_index: 1,
                //     glow_show: true,

                //     position: {
                //         left: 92.5,
                //         right: '',
                //         top: 60.5,
                //         bottom: '',
                //     },
                //     time: '',
                // },
                {
                    No: 1,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi7.png',
                        'img/game/suijingshi7.png',
                    ],

                    crystal: 'img/game/mojing7.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi7.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-7.png',
                        'img/game/glow2/guangyuan1-7.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 92.5,
                        right: '',
                        top: 60.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 2,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi8.png',
                        'img/game/suijingshi8.png',
                    ],

                    crystal: 'img/game/mojing8.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi8.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-8.png',
                        'img/game/glow2/guangyuan1-8.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 166,
                        right: '',
                        // top: 42.5,
                        top: 50,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 3,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi7.png',
                        'img/game/suijingshi7.png',
                    ],

                    crystal: 'img/game/mojing7.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi7.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-7.png',
                        'img/game/glow2/guangyuan1-7.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 246.5,
                        right: '',
                        top: 58,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 4,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi8.png',
                        'img/game/suijingshi8.png',
                    ],

                    crystal: 'img/game/mojing8.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi8.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-8.png',
                        'img/game/glow2/guangyuan1-8.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 307,
                        right: '',
                        top: 98,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 5,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi7.png',
                        'img/game/suijingshi7.png',
                    ],

                    crystal: 'img/game/mojing7.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi7.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-7.png',
                        'img/game/glow2/guangyuan1-7.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 283,
                        right: '',
                        top: 172,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 6,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi6.png',
                        'img/game/suijingshi6.png',
                    ],

                    crystal: 'img/game/mojing6.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi6.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-6.png',
                        'img/game/glow2/guangyuan1-6.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 204.5,
                        right: '',
                        // top: 170,
                        top: 180,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 7,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi5.png',
                        'img/game/suijingshi5.png',
                    ],

                    crystal: 'img/game/mojing5.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi5.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-5.png',
                        'img/game/glow2/guangyuan1-5.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 123.5,
                        right: '',
                        // top: 170,
                        top: 180,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 8,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi4.png',
                        'img/game/suijingshi4.png',
                    ],

                    crystal: 'img/game/mojing4.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi4.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-4.png',
                        'img/game/glow2/guangyuan1-4.png',
                    ],
                    glow_index: 0,
                    glow_show: true,

                    position: {
                        left: 54.5,
                        right: '',
                        top: 170+44,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 9,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi3.png',
                        'img/game/suijingshi3.png',
                    ],

                    crystal: 'img/game/mojing3.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi3.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-3.png',
                        'img/game/glow2/guangyuan1-3.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 53,
                        right: '',
                        top: 294.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 10,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi2.png',
                        'img/game/suijingshi2.png',
                    ],

                    crystal: 'img/game/mojing2.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi2.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-2.png',
                        'img/game/glow2/guangyuan1-2.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 129,
                        right: '',
                        // top: 310,
                        top: 320,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 11,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi1.png',
                        'img/game/suijingshi1.png',
                    ],

                    crystal: 'img/game/mojing1.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi1.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-1.png',
                        'img/game/glow2/guangyuan1-1.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 207,
                        right: '',
                        // top: 314.5,
                        top: 324.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 12,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi4.png',
                        'img/game/suijingshi4.png',
                    ],

                    crystal: 'img/game/mojing4.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi4.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-4.png',
                        'img/game/glow2/guangyuan1-4.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 271.5,
                        right: '',
                        top: 347,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 13,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi7.png',
                        'img/game/suijingshi7.png',
                    ],

                    crystal: 'img/game/mojing7.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi7.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-7.png',
                        'img/game/glow2/guangyuan1-7.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 261.5,
                        right: '',
                        top: 434.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 14,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi6.png',
                        'img/game/suijingshi6.png',
                    ],

                    crystal: 'img/game/mojing6.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi6.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-6.png',
                        'img/game/glow2/guangyuan1-6.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 197.5,
                        right: '',
                        top: 446.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 15,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi8.png',
                        'img/game/suijingshi8.png',
                    ],

                    crystal: 'img/game/mojing8.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi8.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-8.png',
                        'img/game/glow2/guangyuan1-8.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 123.5,
                        right: '',
                        // top: 448,
                        top: 458,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 16,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi5.png',
                        'img/game/suijingshi5.png',
                    ],

                    crystal: 'img/game/mojing5.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi5.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-5.png',
                        'img/game/glow2/guangyuan1-5.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 58,
                        // left: 58+5,
                        right: '',
                        top: 480,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 17,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi4.png',
                        'img/game/suijingshi4.png',
                    ],

                    crystal: 'img/game/mojing4.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi4.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-4.png',
                        'img/game/glow2/guangyuan1-4.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 86,
                        right: '',
                        // top: 548.5,
                        top: 538.5,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 18,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi1.png',
                        'img/game/suijingshi1.png',
                    ],

                    crystal: 'img/game/mojing1.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi1.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-1.png',
                        'img/game/glow2/guangyuan1-1.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 164,
                        right: '',
                        top: 560,
                        bottom: '',
                    },
                    time: '',
                },
                {
                    No: 19,
                    show: false,

                    deblocking: false,// 是否已解锁
                    place: false,// 是否已放置水晶

                    scatter: false,

                    imgs: [
                        'img/game/jingshi1.png',
                        'img/game/suijingshi1.png',
                    ],

                    crystal: 'img/game/mojing1.png',
                    crystal_and_glow_an: false,

                    small: 'img/game/xiaojingshi1.png',
                    small_show: false,
                    crystal_small_an: false,

                    own_an: false,

                    glows: [
                        'img/game/glow1/guangyuan1-1.png',
                        'img/game/glow2/guangyuan1-1.png',
                    ],
                    glow_index: 1,
                    glow_show: true,

                    position: {
                        left: 247,
                        right: '',
                        top: 549,
                        bottom: '',
                    },
                    time: '',
                },
            ],

            notice_txt: '尊敬的用户，当天一键生产时间结束后，必须点击自己的能源才能收获iU币，如晚上23点之后还没有点击自己的能源进行收获，当天收益则为0',// 公告栏文字



            // 功能按钮
            /*
                图片实际尺寸: 114 x 114
                页面对比 => 375px下的 63px
                设计稿占据大小
                    宽度 45或40 
                    高度 同宽 
                    => 设置非固定大小
            */
            btns: [
                // 
                /*
                    图片实际尺寸: 114 x 114
                    设计稿占据大小: 
                        宽度 45或40 
                        高度 同宽 
                        => 设置非固定大小
                    页面对比: 
                        40 => 375px下的 57.5 px
                        45 => 375px下的 63 px
                */
                {
                    name: 'controller',
                    // type: 'test_mode',// 测试模式打开
                    show: function(){
                        return that.controller_btn_show;
                    },
                    // show: true,
                    box_class: 'f_c',
                    class: 'btn_style_1 box_bd txt_warp  circle f_c ta_c ',
                    txt: '控制器',
                    width: '58',
                    height: '58',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        // bottom: 17.5+58*6,
                        bottom: 17.5+58*4,
                    },
                    fn: function(){
                        that.controller_show = true;
                    },
                },
                {
                    name: 'go_test',
                    // type: 'test_mode',// 测试模式打开
                    show: false,
                    // show: true,
                    // box_class: 'btn',
                    img: '//webh5.wangjiangwei.top/favicon.ico',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        bottom: 17.5+58*5,
                    },
                    fn: function(){
                        that.jump(that.create_dataset({
                            url: '//webh5.wangjiangwei.top/',
                        }))
                    },
                },
                {
                    name: 'reload',
                    // type: 'test_mode',// 测试模式打开
                    show: false,
                    // show: true,
                    // box_class: 'btn',
                    img: 'img/game/wodedaoju.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        bottom: 17.5+58*4,
                    },
                    fn: function(){
                        // Javascript刷新页面的几种方法：
                        // 1 
                        history.go(0) 
                        // 2 
                        // location.reload() 
                        // 3 
                        // location=location 
                        // 4 
                        // location.assign(location) 
                        // 5 
                        // document.execCommand('Refresh') 
                        // 6 
                        // window.navigate(location) 
                        // 7 
                        // location.replace(location) 
                        // 8 
                        // document.URL=location.href
                    },
                },
                {
                    name: 'userProps',
                    show: true,
                    img: 'img/game/wodedaoju.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        // bottom: 189.5,
                        bottom: 17.5+58*3,
                    },
                    fn: function(){
                        that.userProps_api();
                        that.props_show = true;
                    },
                },
                {
                    name: 'prpoMall',
                    show: true,
                    img: 'img/game/daojushangcheng.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        // bottom: 131.5,
                        bottom: 17.5+58*2,
                    },
                    fn: function(){
                        that.prpoMall_page=1;
                        that.prpoMall_api();
                        that.prpoMall_show = true;
                    },
                },
                {
                    name: 'friendList',
                    show: true,
                    img: 'img/game/haoyouliebiao.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        // bottom: 74.5,
                        bottom: 17.5+58*1,
                    },
                    fn: function(){
                        if(!(that.friendList&&that.friendList.length)){
                            that.friendList_page=1;
                            that.friendList_api();
                        }
                        that.friendList_show = true;
                    },
                },
                {
                    name: 'record',
                    show: true,
                    img: 'img/game/jilu.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '',
                        right: '12.5',
                        top: '',
                        // bottom: 17.5,
                        bottom: 17.5+58*0,
                    },
                    fn: function(){
                        that.record_page=1;
                        that.record_api();
                        that.recordList_show = true;
                    },
                },
                {
                    name: 'produce',
                    show: function(){
                        console.log('一键生产 show', this, that.show_type);
                        return that.show_type!="friend";
                    },
                    img: 'img/game/yijianshengchan.png',
                    width: '(90 + 5)',
                    height: '',
                    position: {
                        left: '',
                        right: '(16 - 1.5)',
                        top: '(45.5 - 1)',
                        bottom: '',
                    },
                    fn: function(){
                        that.produce_api();
                    },
                },
                {
                    name: 'quit',// 退出基地
                    show: function(){
                        console.log('退出基地 show', this, that.show_type);
                        return that.show_type!="friend";
                    },
                    img: 'img/game/fanhui.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '12',
                        right: '',
                        top: '',
                        bottom: 17.5,
                    },
                    fn: function(){
                        that.quit_show = true;
                    },
                },
                {
                    name: 'mine',// 我的基地
                    show: function(){
                        console.log('我的基地 show', this, that.show_type);
                        return that.show_type=="friend";
                    },
                    img: 'img/game/wodejidi.png',
                    // img: 'img/game/fanhui.png',
                    width: '58',
                    height: '',
                    position: {
                        left: '12',
                        right: '',
                        top: '',
                        bottom: 17.5,
                    },
                    fn: function(){
                        window.history.go(-1);

                        /* window.history.go(number|URL);
                            提供URL作为参数是一项非标准功能，
                                因此无法在所有浏览器中使用。大多数浏览器仅接受相对编号，例如1或-1。
                                window.history.go('game.html');//url根本不起作用

                            从MDC文档（重点是我的）：

                            [ history.go(integerDelta)]从会话历史记录中加载页面，
                            该页面由其相对于当前页面的相对位置标识，
                            例如，上一页为-1，下一页为1。
                            当integerDelta超出界限时
                            （例如，在会话历史记录中没有以前访问的页面时为-1），
                            该方法不会执行任何操作，也不会引发异常。

                            调用go()无参数或具有非整数参数没有影响
                            （不像IE浏览器，它支持字符串的URL作为参数）。

                            当您使用W3Schools作为学习资源时，会发生这种情况;-)
                        */

                        // 未成功 ---------------------
                        // window.history.go(-window.history.length+1);
                        // window.location.replace('game.html?user_token='+( this.user_token||getQueryString('user_token') ) );
                        // 未成功 -end ---------------------


                    },
                },
            ],

            quit_show: false, // 退出游戏提示

            mine:{
                asset: '',
                integral: '',
            },

            // popup_list_show: true, // 弹出消息列表显示
            // show: true, // 弹出消息列表显示

            // 道具商城 列表
            prpoMall_show: false, // 道具列表显示
            prpoMall_refreshing: false,
            prpoMall_page: 1,
            prpoMall_loading: false,
            prpoMall_more: true, 
            prpoMall_error:false,
            prpoMall: [
                // 
                /*
                    图片实际尺寸: 114 x 114
                    设计稿占据大小: 
                        宽度 45或40 
                        高度 同宽 
                        => 设置非固定大小
                    页面对比: 
                        40 => 375px下的 57.5 px
                        45 => 375px下的 63 px
                */
                {
                    img: 'img/game/jidi.png',
                    name: '基地扩展券',
                    currency_price: '2',
                },
                {
                    img: 'img/game/baohuzao.png',
                    name: '保护罩',
                    currency_price: '12',
                },
            ],

            prop_id: '', // 购买道具id
            buyProp_show: false, // 购买道具弹窗


            tradeCode_show: false, // 交易密码弹窗
            tradeCode: '', // 交易密码
            tradeCode_keyboard_shows: false,// 数字键盘显示

            

            // 我的道具 列表
            props_show: false, // 道具列表显示
            props: [
                // 
                /*
                    图片实际尺寸: 114 x 114
                    设计稿占据大小: 
                        宽度 45或40 
                        高度 同宽 
                        => 设置非固定大小
                    页面对比: 
                        40 => 375px下的 57.5 px
                        45 => 375px下的 63 px
                */
                {
                    img: 'img/game/jidi.png',
                    name: '基地扩展券',
                    num: '2',
                },
                {
                    img: 'img/game/baohuzao.png',
                    name: '保护罩',
                    num: '12',
                },
            ],

            tool_id: '', // 使用道具id
            tool_type: '', // 使用道具类型
            useProp_show: false, // 使用道具提示

            // 我的好友 列表
            friendList_show: false, // 我的好友 显示
            friendList_refreshing: false,
            friendList_page: 1,
            friendList_loading: false,
            friendList_more: true, 
            friendList_error:false,
            friendList: [
                /*
                    username    string  手机号
                    img string  头像
                    nickname    string  昵称
                    reap_status int 0无星星1有星星
                */
                {
                    "identifier": "m555df076dda29a6",
                    "username": "13783461001",
                    "img": "img/game/touxiang.png",
                    "nickname": "XZ3hMso",
                    "reap_status": 0,

                    "no_reap_num": 0,
                    "last_produce_date": "0000-00-00",
                },
            ],

            // 记录 列表
            recordList_show: false, // 记录 显示
            record_refreshing: false,
            record_page: 1,
            record_loading: false,
            record_more: true, 
            record_error:false,
            recordList: [
                /*
                    nickname    string  昵称
                    money   decimal 金额
                    create_at   datetime    创建时间
                */
                {
                    "nickname": "张三",
                    "create_at": "2019-12-30 10:32:51",
                    "money": "0.2560",
                },
            ],


            // 未使用 --------------------------------------------------
            // verify_click: true, // 验证码可点击
            verify_times: 60, // 验证码倒计时最大数
            verify_time: 0, // 验证码倒计时

            form_click: false, // 表单可点击

            type: getQueryString('type')==2?2:1,
            title: getQueryString('type')==2?'此代理':'此学员',

            search_txt: '', // 搜索文本
            empty_data:false,
            search_list: [
                // 
                // {
                //     "id": 19,
                //     "name": "王"
                // },
            ],
            // 未使用 -end --------------------------------------------------

            // name: 666,
        };
    },

    watch: {


        // test_mode 静态数据模式
        test_mode: {

            immediate: true,  //刷新加载 立马触发一次handler
            // deep: true,  // 当监听属性为 对象 时, 可以深度检测到 对象 内部的属性值的变化
            handler: function(newValue, oldValue) {
                console.log('test_mode 发送变动 watch', newValue, oldValue, arguments);

                var that = this;

                // 判断是否是第一次启动
                if(!this.test_mode_immediate){
                    this.test_mode_immediate=1

                    this.crystals_test_mode= this.crystals;
                    this.prpoMall_test_mode= this.prpoMall;
                    this.props_test_mode= this.props;
                    this.friendList_test_mode= this.friendList;
                    this.recordList_test_mode= this.recordList;
                }



                // if(newValue){
                if(this.test_mode){
                    this.user_token = window.user_token_test;

                    this.crystals.map(function(item){
                        item.show=true;
                        item.place=true;
                    });

                    this.btns.map(function(item){
                        if(item.type=='test_mode'){
                            item.show=true;
                        }
                    });

                    this.prpoMall = this.prpoMall_test_mode;
                    this.props = this.props_test_mode;
                    this.friendList = this.friendList_test_mode;
                    this.recordList = this.recordList_test_mode;


                }else{
                    this.user_token = 
                    getQueryString('user_token')
                    // ||window.user_token_test
                    ||''
                    ;



                    this.crystals.map(function(item){
                        item.show=false;
                        item.place=false;
                    });
                    newValue==false
                    &&
                    oldValue!=undefined
                    &&
                    setTimeout(function(res){
                        that.homePage();
                    }, 0)



                    this.btns.map(function(item){
                        if(item.type=='test_mode'){
                            item.show=false;
                        }
                    });

                    this.prpoMall = [];
                    this.props = [];
                    this.friendList = [];
                    this.recordList = [];

                }






                return 123;//无用
            },
        },


        // test_account 开启测试账号
        test_account: {

            immediate: true,  //刷新加载 立马触发一次handler
            // deep: true,  // 当监听属性为 对象 时, 可以深度检测到 对象 内部的属性值的变化
            handler: function(newValue, oldValue) {
                console.log('test_account 发送变动 watch', newValue, oldValue, arguments);

                // if(newValue){
                if(this.test_account){
                    this.user_token = window.user_token_test||'';
                }else{
                    this.user_token = getQueryString('user_token')
                        // ||window.user_token_test
                        ||''
                    ;
                }
                oldValue==false&&this.page_refreshing_fn();
            },
        },



        // page_scale 页面内容拉伸
        page_scale: {

            immediate: true,  //刷新加载 立马触发一次handler
            // deep: true,  // 当监听属性为 对象 时, 可以深度检测到 对象 内部的属性值的变化
            handler: function(newValue, oldValue) {
                console.log('page_scale 发送变动 watch', newValue, oldValue, arguments);

                var change = true ;
                if( 
                    document.documentElement.clientHeight 
                    /  
                    document.documentElement.clientWidth 

                    <=

                    1334
                    /
                    750 
                ){
                    console.log('页面内容高度大于页面高度', 
                        document.documentElement.clientHeight 
                        /  
                        document.documentElement.clientWidth 
                        , 
                        1334
                        /
                        750
                    );
                    // return
                    change = false;
                }

                // if(newValue){
                if(this.page_scale){
                    this.crystals.map(function(item){

                        item.position.left+='';
                        !(isNaN( item.position.left ) || item.position.left==='' || item.position.left===' ')
                        &&
                        (item.position.left += 'vw ');
                        if(change){
                            // item.position.left = item.position.left.replace('vw', 'vh / 1334 * 750');
                        }

                        item.position.right+='';
                        !(isNaN( item.position.right ) || item.position.right==='' || item.position.right===' ')
                        &&
                        (item.position.right += 'vw ');
                        if(change){
                            // item.position.right = item.position.right.replace('vw', 'vh / 1334 * 750');
                        }

                        item.position.top+='';
                        !(isNaN( item.position.top ) || item.position.top==='' || item.position.top===' ')
                        &&
                        (item.position.top += 'vw ');
                        if(change){
                            item.position.top = item.position.top.replace('vw', 'vh / 1334 * 750');
                        }

                        item.position.bottom+='';
                        !(isNaN( item.position.bottom ) || item.position.bottom==='' || item.position.bottom===' ')
                        &&
                        (item.position.bottom += 'vw ');
                        if(change){
                            item.position.bottom = item.position.bottom.replace('vw', 'vh / 1334 * 750');
                        }


                    });
                }else{
                    this.crystals.map(function(item){

                        item.position.left+='';
                        !(isNaN( item.position.left ) || item.position.left==='' || item.position.left===' ')
                        &&
                        (item.position.left += 'vw ');
                        // (item.position.left += 'vh / 1334 * 750 ');
                        // item.position.left = item.position.left.replace('vh / 1334 * 750', 'vw');

                        item.position.right+='';
                        !(isNaN( item.position.right ) || item.position.right==='' || item.position.right===' ')
                        &&
                        (item.position.right += 'vw ');
                        // (item.position.right += 'vh / 1334 * 750 ');
                        // item.position.right = item.position.right.replace('vh / 1334 * 750', 'vw');

                        item.position.top+='';
                        !(isNaN( item.position.top ) || item.position.top==='' || item.position.top===' ')
                        &&
                        (item.position.top += 'vh / 1334 * 750 ');
                        item.position.top = item.position.top.replace('vh / 1334 * 750', 'vw');

                        item.position.bottom+='';
                        !(isNaN( item.position.bottom ) || item.position.bottom==='' || item.position.bottom===' ')
                        &&
                        (item.position.bottom += 'vh / 1334 * 750 ');
                        item.position.bottom = item.position.bottom.replace('vh / 1334 * 750', 'vw');

                    });

                }
            },
        },

        /*
            protect_status: '',//保护罩状态0不存在1存在
            protect_surplus_time: '',// 保护罩剩余时间-秒数
            protect_surplus_times: '',// 保护罩剩余时间-显示内容
        */
        protect_surplus_time: {


            immediate: true,  //刷新加载 立马触发一次handler
            // deep: true,  // 当监听属性为 对象 时, 可以深度检测到 对象 内部的属性值的变化
            handler: function(newValue, oldValue) {
                console.log('protect_surplus_time 发送变动 watch', newValue, oldValue, arguments);
                var that = this;

                console.log('清除计时器');
                clearTimeout(this.protect_surplus_timer);

                if(this.protect_status==1 && this.protect_surplus_time>0){

                    this.protect_surplus_times=formatSeconds(this.protect_surplus_time).replace(/[天分]|小时/g,':').replace(/秒/g,'');
                    if(this.protect_surplus_times!=0&&!isNaN(this.protect_surplus_times)){
                        this.protect_surplus_times = '00:'+this.protect_surplus_times;
                    }
                    if(this.protect_surplus_times==0){
                        this.protect_surplus_times = '';
                    }

                    this.protect_surplus_timer = setTimeout(function(res){
                        that.protect_surplus_time--;
                    }, 1000);

                }else{
                    this.protect_status=0;
                    this.protect_surplus_time=0;
                    this.protect_surplus_times='00:00';
                    return;
                }

            },
        },


    },

    created: function (e) {
        console.log('实例创建完成后 created', arguments);
        var that = this;

        // 判断当前场景以及切换的时间
        this.checkTime();


        /*
            show_type: 'friend',// 显示的类型
        */
        switch(getQueryString('types')){
            // 模板
            case 'friend': 
                console.log('切换显示的类型 show_type friend', getQueryString('types'));
                this.show_type = 'friend';
                document.title = '好友基地';
                // alert('document.title');
                // var nickname = getQueryString('alert_txt')||'好友';
                // vant.Toast('欢迎来到'+this.nickname+'的基地');



                break;
            default: 
                console.log('切换显示的类型 show_type 无指定', getQueryString('types'));
                this.show_type = getQueryString('types');
                break;
        }

        switch(getQueryString('fn_types')){
            case 'controll': 
                console.log('显示控制器 fn_types controll', getQueryString('fn_types'));
                this.controller_btn_show = true;
                break;
            default: 
                console.log('显示控制器 fn_types default', getQueryString('fn_types'));
                break;
        }

        setTimeout(function(res){
            that.homePage();
        }, 0)

        // alert('set_title');
        // vant.Toast('set_title');
        app_fn({name:'set_title', param: document.title});


        // 页面二次显示/页面跳转时延迟执行
        this.jump_back = this.onShow||this.onshow||this.jump_back;

    },


    methods: {
        app_fn: app_fn,

        // 通用 ------------------------------------------------


        // 提取自定义参数 var {name} = this.dataset(e);
        dataset: function dataset(e) {
            console.log('提取自定义参数', e);
            if (e) {
                var param = e.currentTarget.dataset.param;
                param && (param = JSON.parse(param));

                // var obj = {
                //     ...e.detail,
                //     ...e.currentTarget.dataset,
                //     // ...e.currentTarget.dataset.param,
                // };
                // param && (obj = { ...obj, ...param });


                var obj = {};
                Object.assign(obj, 
                    e.detail,
                    e.currentTarget.dataset,
                    param||{}
                );


                return obj;
            } else {
                return {};
            }
        },
        // 判断请求网站, 是否添加前缀;  getUrl(url);
        getUrl: function getUrl(url){
            var http_pre = window.http || 
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
        },

        // 切换布尔值 bindtap='trigger' data-name='name' catchtap='trigger' 
        trigger: function(name) {
            console.log('切换布尔值', name, arguments);
            this[name] = !this[name];

        },
        retuen_value: function(name, type){
            console.log('返回this值', name, arguments);
            var value = this[name];
            
            switch(type){
                case 'bool': 
                    console.log('返回this值 返回类型要求 布尔值 ', type);
                    value==='0'&&(value=false);
                    value=!!value;
                    break;
                default: 
                    break;
            }
            return value;
        },


        console_log: function(value) {
            console.log(value);
        },
        // alert弹窗 
        alert: function(e) {
            console.log('alert弹窗', e, JSON.stringify(e), arguments, JSON.stringify(arguments));
            console.log('alert弹窗 e.currentTarget', e.currentTarget, JSON.stringify(e.currentTarget));

            var obj = this.dataset(e)||{};
            var alert_txt = obj.alert_txt||'';
            if(!alert_txt){
                prompt('参数alert_txt为空 e', JSON.stringify(e));
                return;
            }
            alert(alert_txt);
        },

        // 暂未开通 
        show_no_open: function(e) {
            console.log('暂未开通', e);
            alert('暂未开通');
        },

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

            var that = this;

            setTimeout(function(res){

                // window.location.href = '/goods/detail?id=' + id;
                // window.location.href = 'detail.html?id=' + id;
                // window.location.href = url + param;

                var href = url + param;

                var jump_type = obj.jump_type;
                switch(jump_type){
                    // 模板
                    case 'replace': 
                        console.log('页面跳转 replace 替换');
                        window.location.replace(href);
                        break;
                    case 'href': 
                        console.log('页面跳转 href 跳转');
                        window.location.href = href;
                        break;
                    default: 
                        window.location.href = href;
                        break;
                }

                // app内嵌h5 window.location.href 部分安卓机 会跳到外部浏览器

                setTimeout(function(res){
                    // vant.Toast('jump_back');
                    that.jump_back();
                }, 100);

            }, 1000);
        },

        // onshow onShow
        jump_back: function(e){
            console.log('跳转时触发 => 卡住 => 等待返回当前页面后继续执行', arguments);

            this.homePage();

            // alert('set_title');
            // vant.Toast('set_title');
            app_fn({name:'set_title', param: document.title});

        },

        // 提示
        Toast: function(text) {
            console.log('提示', text);
            vant.Toast(text);
        },

        // setTimeout: function(fn, time=0, ...arg ){
        //     var that = this;
        //     setTimeout(function(){
        //         // fn.call(that, ...arg)
        //         that[fn](...arg)
        //     }, time||0);
        //     // setTimeout(this.fn, time=0);
        // },

        // 通用 -end ------------------------------------------------

        // app ------------------------------------------------

        // 部分苹果手机点击输入框导致页面被顶起，按钮不灵敏
        input_dysfunction: function(url){
            console.log('点击输入框导致页面被顶起，按钮不灵敏', arguments);

            var topInputNum;
            $(document).on('focus', ':input', function() {
                topInputNum = $("body").scrollTop();
            }).on('blur', ':input', function() {
                $("body").scrollTop(topInputNum);
            })
        },
        input_dysfunction_focus: function(url){
            console.log('点击输入框导致页面被顶起，按钮不灵敏  focus', arguments);

            /*
                部分ios 
                    $('body').scrollTop()  无效。
                    $(’html').scrollTop() 有效

                为了防止其它浏览器这样，我们就可以写成：
                    $('html,body').scrollTop()
            */

            // this.topInputNum = $("html,body").scrollTop();

            // alert('input_dysfunction_focus '+$("html,body").scrollTop());
            // vant.Toast('input_dysfunction_focus '+$("html,body").scrollTop());

            // setInterval(()=>{

            //     alert('setInterval input_dysfunction_focus '+$("html,body").scrollTop());
            //     vant.Toast('setInterval input_dysfunction_focus '+$("html,body").scrollTop());
                
            // }, 2000);

            // 聚焦时 $("html,body").scrollTop()为0, 部分ios 需要延迟才能获取真实数据 
            // setTimeout 0 未获取
            // setTimeout 100 可获取
            var that = this;
            setTimeout(function(){

                that.topInputNum = $("html,body").scrollTop();
                // alert('setTimeout input_dysfunction_focus '+$("html,body").scrollTop());
                // vant.Toast('setTimeout input_dysfunction_focus '+$("html,body").scrollTop());
                
            }, 100);
        },
        input_dysfunction_blur: function(url){
            console.log('点击输入框导致页面被顶起，按钮不灵敏  blur', arguments);

            $("html,body").scrollTop(this.topInputNum);

            // alert('input_dysfunction_blur '+this.topInputNum);
            // vant.Toast('input_dysfunction_blur '+this.topInputNum);
        },

        quit: function(){
            console.log('退出基地 quit函数 调用', arguments);

            app_fn({name:'quit', param: ''});//不可行

        },
        app_jump: function(url){
            console.log('跳转app页面 app_jump函数 调用', arguments);

            app_fn({name:'app_jump', param: {url:url}});

        },
        // app -end ------------------------------------------------

        // 判断当前场景以及切换的时间
        checkTime: function checkTime(){

            // 白天时间: 5:00 - 19:00
            // 夜间时间: (7+12):00 - 5:00
            // this.bg_index=( checkAuditTime("19:00", "24:00")||checkAuditTime("0:00", "5:00") )?1:0;
            // console.log(checkAuditTime("19:00", "24:00")?'夜间时间':'白天时间');


            var curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
            var nextDate = new Date(curDate.getTime() + 24*60*60*1000); //后一天
            var str;
            var start_str = '5:00';
            var end_str = '19:00';
           // console.log( format('', 'yyyy-MM-dd'));
            if( checkAuditTime(start_str, end_str) ){
                console.log('白天时间');
                this.bg_index = 0;
                str = format(curDate, 'yyyy-MM-dd')+ ' ' + (end_str + ':00');

                // :class='bg_index==1?"page_box_night":"page_box_day"'
                $('html').removeClass('page_box_night').addClass('page_box_day');

            }else{
                console.log('夜间时间');
                this.bg_index = 1;
                str = format(nextDate, 'yyyy-MM-dd')+ ' ' + (start_str + ':00');

                // :class='bg_index==1?"page_box_night":"page_box_day"'
                $('html').removeClass('page_box_day').addClass('page_box_night');

            }


            console.log( 'str', str);
            var endtime = new Date(str);
            console.log( 'endtime', endtime);
            // var diff_s = parseInt( (endtime.getTime() - new Date().getTime())/1000 );
            var diff_ms = endtime.getTime() - new Date().getTime();
            console.log( 'diff_ms', diff_ms);
            console.log( 'endtime.getTime()', endtime.getTime());
            console.log( 'new Date().getTime()', new Date().getTime());
            // setInterval(()=>{
            //     console.log( 'diff_ms', endtime.getTime() - new Date().getTime());
            // }, 1000);
            var that = this;
            setTimeout(function(){
                console.log( '切换场景判断');
                that.checkTime();
            }, diff_ms);
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
                // param:{},// data 或 param
                data:{
                    tel: this.tel,
                    password: this.password,
                    code: this.code,
                    inviter: this.inviter,
                },
                success: function(res) {
                    console.log('注册 接口返回 成功', res);
                    vant.Toast('注册成功');
                    that.show_type="register_ok_show";

                },
                fail: function(res) {
                    console.log('注册失败', res);
                    vant.Toast(res.message||'注册失败');
                }
            })
        },

        // 农场界面
        homePage: function(e, loading) {
            console.log('农场界面 接口', e);
            (loading==undefined||loading==null)&&(loading=true)
            
            var title = this.show_type=='friend'?'好友主页':'农场界面';
            var url = this.show_type=='friend'?'farm/friendHome':'farm/homePage';
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'GET',
                url:url,
                // param:{},// data 或 param
                data:{
                    tel: getQueryString('username'),
                },
                loading: loading,
                success: 
                    function(res) {
                        console.log((title+' 接口返回'), res);
                        if(res.code==0){

                            that.mine.asset = res.data.asset;
                            that.mine.integral = res.data.integral;

                            that.protect_status = res.data.protect_status;
                            // protect_status   int 保护罩状态0不存在1存在
                            if(that.protect_status==1){
                                that.protect_surplus_time = res.data.protect_surplus_time;
                                that.protect_surplus_times=formatSeconds(that.protect_surplus_time).replace(/[天分]|小时/g,':').replace(/秒/g,'');
                                if(that.protect_surplus_times!=0&&!isNaN(that.protect_surplus_times)){
                                    that.protect_surplus_times = '00:'+that.protect_surplus_times;
                                }
                                if(that.protect_surplus_times==0){
                                    that.protect_surplus_times = '';
                                }
                            }

                            var deblocking_num = res.data.deblocking_num;//基地解锁数量

                            var holding = res.data.holding||[];//基地
                            that.crystals.map(function(item,index){
                                item.show=false;
                                // item.glow_show=false;
                                if(index+1 <= deblocking_num){
                                    item.show=true;
                                    item.deblocking=true;
                                }
                                if(holding[index]){
                                    item.show=true;
                                    item.place=true;
                                    item.id=holding[index].id;

                                    item.name=holding[index].name;
                                    item.surplus_income=holding[index].surplus_income;
                                    item.harvest_status=holding[index].harvest_status;
                                    item.stolen_income=holding[index].stolen_income;
                                    // stolen_status    int 偷取状态，0不能偷取1可以偷取
                                    item.stolen_status=holding[index].stolen_status;
                                    item.describe=holding[index].describe;

                                    if(holding[index].grade==99){
                                        item.imgs=[
                                            'img/game/gattai.png',
                                            'img/game/gattai2.png',
                                            // 'img/game/suijingshi7.png',
                                        ];
                                        item.crystal='img/game/gattai.png';
                                        item.small= 'img/game/kakera_b.png';
                                        item.glows=[
                                            'img/game/glow1/guangyuanf1-3.png',
                                            'img/game/glow2/guangyuanf1-3.png',
                                        ];
                                    }else{
                                        item.imgs=item.imgs.map(function(img){return img.replace(/\d\./,(holding[index].grade)+'.') });
                                        item.crystal=item.crystal.replace(/\d\./,(holding[index].grade)+'.');
                                        item.small=item.small.replace(/\d\./,(holding[index].grade)+'.');
                                        item.glows=item.glows.map(function(img){return img.replace(/\d\./,(holding[index].grade)+'.') });
                                    }


                                    // task_status  int 0未生产1未成熟2已成熟3已收割
                                    item.task_status=holding[index].task_status;
                                    item.small_show=holding[index].task_status==2;

                                    item.ripe_surplus_time=holding[index].ripe_surplus_time;
                                    // console.log('item.ripe_surplus_time', item.ripe_surplus_time);
                                    item.time=formatSeconds(holding[index].ripe_surplus_time).replace(/[天分]|小时/g,':').replace(/秒/g,'');
                                    if(item.time!=0&&!isNaN(item.time)){
                                        item.time = '00:'+item.time;
                                    }
                                    if(item.time==0){
                                        item.time = '';
                                    }
                                }
                            });

                            // return;

                            // that.homePage_timer&&clearInterval(that.homePage_timer);
                            console.log('清除循环计时器');
                            clearInterval(that.homePage_timer);
                            that.homePage_timer = setInterval(function(){
                                console.log('循环计时器 执行中');
                                // some every
                                // if(that.crystals.every(item=>!item.time)&&that.protect_status==0){
                                if(that.crystals.every( function(item){return !item.time} ) ){
                                    console.log('清除循环计时器');
                                    clearInterval(that.homePage_timer);
                                }

                                // if(that.protect_status==1){
                                //     if(that.protect_surplus_time>0){
                                //         that.protect_surplus_time--;
                                //         that.protect_surplus_times=formatSeconds(that.protect_surplus_time).replace(/[天分]|小时/g,':').replace(/秒/g,'');
                                //         if(that.protect_surplus_times!=0&&!isNaN(that.protect_surplus_times)){
                                //             that.protect_surplus_times = '00:'+that.protect_surplus_times;
                                //         }
                                //     }
                                //     else{
                                //         that.protect_status = 0;
                                //         that.protect_surplus_time = 0;
                                //         that.protect_surplus_times = '';
                                //     }
                                // }

                                // that.homePage();
                                that.crystals.map(function (item,index){
                                    if(item.ripe_surplus_time>0){
                                    // if(item.time){
                                        item.ripe_surplus_time--;
                                        item.time=formatSeconds(item.ripe_surplus_time).replace(/[天分]|小时/g,':').replace(/秒/g,'');
                                        if(item.time!=0&&!isNaN(item.time)){
                                            item.time = '00:'+item.time;
                                        }
                                    }else{
                                        item.ripe_surplus_time = 0;
                                        item.time = '';
                                    }

                                    if(!item.time && item.task_status==1){

                                        // task_status  int 0未生产1未成熟2已成熟3已收割
                                        // item.small_show=holding[index].task_status=2;
                                        // stolen_status    int 偷取状态，0不能偷取1可以偷取

                                        item.task_status=2;
                                        item.stolen_status=1;
                                        item.small_show=true;
                                    }
                                });
                                that.crystals = that.crystals;

                            }, 1000);
                        }else{
                            vant.Toast(res.message||(title+' 失败'));
                        }

                    },
                fail: function(res) {
                    console.log((title+' 接口失败'), res);
                }
            })
        },


        // 道具商城
        prpoMall_api: function(e) {
            console.log('道具商城 接口', e);

            // 二次封装函数
            var that = this;

            this.prpoMall_loading = true;
            this.prpoMall_page||(this.prpoMall_page=1);

            if(this.prpoMall_page==1){
                this.prpoMall_more = true;
            }
            wjw_http({
                type:'POST',
                url:'farm/prpoMall',
                data:{
                    page: this.prpoMall_page,
                    limit: 10,
                },
                before_fn: 
                    function(res) {
                        console.log('请求前执行函数', res);
                        if(that.prpoMall_page==1){
                            that.prpoMall=[];
                        }
                    },
                success: 
                    function(res) {
                        console.log('道具商城 接口返回', res);
                        that.prpoMall_loading = false;

                        if(that.prpoMall_page==1){
                            that.prpoMall_refreshing=false;
                        }

                        if(res.code==0){

                            // that.prpoMall = res.data;
                            var data = res.data||[];
                            if(data.length){
                                // that.prpoMall.push(...data);
                                // that.prpoMall =Object.assign({}, that.prpoMall, data);
                                that.prpoMall = that.prpoMall.concat(data);
                                that.prpoMall_page++;
                            }else{
                                that.prpoMall_more = false;
                            }
                        }else{
                            that.prpoMall_error = true;
                            vant.Toast(res.message||'道具商城 失败');
                        }


                    },
                fail: function(res) {
                    console.log('道具商城 接口失败', res);
                    that.prpoMall_refreshing=false;
                    that.prpoMall_loading = false;
                    that.prpoMall_error = true;
                }
            })
        },

        // 购买道具
        buyProp_api: function(e) {
            console.log('购买道具 接口', e);
            var trade_code = this.tradeCode;
            this.tradeCode = '';
            this.buyProp_show = false;
            this.tradeCode_show = false;
            
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/buyProp',
                data:{
                    prop_id: this.prop_id,
                    trade_code: trade_code,
                },
                success:
                    function(res) {
                        console.log('购买道具 接口返回', res);
                        if(res.code==0){
                            vant.Toast('购买成功');
                            // 道具商城
                            this.prpoMall_page=1;
                            that.prpoMall_api();
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'购买道具 失败');
                        }

                    },
                fail: function(res) {
                    console.log('购买道具 接口失败', res);
                }
            })
        },

        // 我的道具
        userProps_api: function(e) {
            console.log('我的道具 接口', e);
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/userProps',
                data:{
                },
                success:
                    function(res) {
                        console.log('我的道具 接口返回', res);
                        if(res.code==0){
                            res.data.task.map(function(item){
                                item.type='task';
                            })
                            // that.props = [ 
                            //     ...res.data.task, 
                            //     ...res.data.prop, 
                            // ];

                            // that.props =Object.assign({}, res.data.task, res.data.prop);

                            that.props = [].concat(res.data.task, res.data.prop);
                            
                        }else{
                            vant.Toast(res.message||'我的道具 失败');
                        }

                    },
                fail: function(res) {
                    console.log('我的道具 接口失败', res);
                }
            })
        },

        // 放置能源
        placeTask_api: function(e) {
            console.log('放置能源 接口', e);
            
            
            this.useProp_show = false;
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/placeTask',
                data:{
                    holding_id: this.tool_id,
                },
                success:
                    function(res) {
                        console.log('放置能源 接口返回', res);
                        if(res.code==0){
                            vant.Toast('使用成功');
                            // 我的道具
                            that.userProps_api();
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'放置能源 失败');
                        }

                    },
                fail: function(res) {
                    console.log('放置能源 接口失败', res);
                }
            })
        },

        // 使用道具
        useProp_api: function(e) {
            console.log('使用道具 接口', e);
            
            this.useProp_show = false;
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/useProp',
                data:{
                    tool_id: this.tool_id,
                },
                success:
                    function(res) {
                        console.log('使用道具 接口返回', res);
                        if(res.code==0){
                            vant.Toast('使用成功');
                            // 我的道具
                            that.userProps_api();
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'使用道具 失败');
                        }

                    },
                fail: function(res) {
                    console.log('使用道具 接口失败', res);
                }
            })
        },

        // 好友列表
        friendList_api: function(e) {
            console.log('好友列表 接口', e);
            
            // 二次封装函数
            var that = this;
            this.friendList_loading = true;
            this.friendList_page||(this.friendList_page=1);

            if(this.friendList_page==1){
                this.friendList_more = true;
            }
            wjw_http({
                loading: this.friendList_page==1,
                type:'POST',
                url:'farm/friendList',
                data:{
                    page: this.friendList_page,
                    limit: 10,
                },
                before_fn: 
                    function(res) {
                        console.log('请求前执行函数', res);
                        if(that.friendList_page==1){
                            that.friendList=[];
                        }
                    },
                success:
                    function(res) {
                        console.log('好友列表 接口返回', res);
                        that.friendList_loading = false;

                        if(that.friendList_page==1){
                            that.friendList_refreshing=false;
                        }
                        if(res.code==0){

                            // that.friendList = res.data;
                            var data = res.data||[];
                            if(data.length){
                                // that.friendList.push(...data);
                                // that.friendList =Object.assign({}, that.friendList, data);// 此处进行讲数组做了对象合并, 所以相当于替换, 需要换成数组合并处理
                                that.friendList = that.friendList.concat(data);
                                that.friendList_page++;
                            }else{
                                that.friendList_more = false;
                            }

                        }else{
                            that.friendList_error = true;
                            vant.Toast(res.message||'好友列表 失败');
                        }
                    },
                fail: function(res) {
                    console.log('好友列表 接口失败', res);
                    that.friendList_refreshing=false;
                    that.friendList_loading = false;
                    that.friendList_error = true;
                },
            })
        },

        // 被偷记录
        record_api: function(e) {
            console.log('被偷记录 接口', e);
            
            // 二次封装函数
            var that = this;
            this.record_loading = true;
            this.record_page||(this.record_page=1);

            if(this.record_page==1){
                this.record_more = true;
            }
            wjw_http({
                type:'POST',
                url:'farm/record',
                data:{
                    page: this.record_page,
                    limit: 10,
                },
                before_fn: 
                    function(res) {
                        console.log('请求前执行函数', res);
                        if(that.record_page==1){
                            that.recordList=[];
                        }
                    },
                success:
                    function(res) {
                        console.log('被偷记录 接口返回', res);

                        if(that.record_page==1){
                            that.record_refreshing=false;
                        }

                        that.record_loading = false;
                        if(res.code==0){

                            // that.record = res.data;
                            var data = res.data||[];
                            if(data.length){
                                // that.recordList.push(...data);
                                // that.recordList =Object.assign({}, that.recordList, data);
                                that.recordList = that.recordList.concat(data);
                                that.record_page++;
                            }else{
                                that.record_more = false;
                            }
                        }else{
                            that.record_error = true;
                            vant.Toast(res.message||'被偷记录 失败');
                        }

                    },
                fail: function(res) {
                    console.log('被偷记录 接口失败', res);
                    that.record_refreshing=false;
                    that.record_loading = false;
                    that.record_error = true;
                },
            })
        },

        // 一键生产
        produce_api: function(e) {
            console.log('一键生产 接口', e);
            
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/produce',
                data:{
                },
                success:
                    function(res) {
                        console.log('一键生产 接口返回', res);
                        if(res.code==0){
                            vant.Toast(res.message);
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'一键生产 失败');
                        }

                    },
                fail: function(res) {
                    console.log('一键生产 接口失败', res);
                }
            })
        },

        // 收割能源
        reap_api: function(holding_id) {
            console.log('收割能源 接口', holding_id);
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/reap',
                data:{
                    holding_id: holding_id||this.holding_id,
                },
                success:
                    function(res) {
                        console.log('收割能源 接口返回', res);
                        if(res.code==0){
                            vant.Toast(res.message);
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'收割能源 失败');
                        }

                    },
            })
        },

        // 助产操作
        steal_api: function(holding_id) {
            console.log('助产操作 接口', holding_id);
            
            // 二次封装函数
            var that = this;
            wjw_http({
                type:'POST',
                url:'farm/steal',
                data:{
                    holding_id: holding_id||this.holding_id,
                },
                success:
                    function(res) {
                        console.log('助产操作 接口返回', res);
                        if(res.code==0){
                            vant.Toast(res.message);
                            that.homePage('', false);
                        }else{
                            vant.Toast(res.message||'助产操作 失败');
                        }

                    },
            })
        },



        page_refreshing_fn: function(){
            console.log('页面刷新', arguments);
            var that = this;

            

            // 判断当前场景以及切换的时间
            this.checkTime();


            /*
                show_type: 'friend',// 显示的类型
            */
            switch(getQueryString('types')){
                // 模板
                case 'friend': 
                    console.log('切换显示的类型 show_type friend', getQueryString('types'));
                    this.show_type = 'friend';
                    document.title = '好友基地';
                    // alert('document.title');


                    break;
                default: 
                    console.log('切换显示的类型 show_type 无指定', getQueryString('types'));
                    this.show_type = getQueryString('types');
                    break;
            }

            setTimeout(function(res){
                that.homePage();
            }, 0)

            // alert('set_title');
            // vant.Toast('set_title');
            app_fn({name:'set_title', param: document.title});

            setTimeout(function(res){
                that.page_refreshing=false;
            }, 1500);

        },



    },
})