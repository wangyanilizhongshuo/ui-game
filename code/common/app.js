console.log('app.js console.log');

// APP 功能/方法 调用
function app_fn(obj){
    var name = obj&&obj.name;
    var param = obj&&obj.param;
    name||(name='')
    param||(param='')
// function app_fn({
//     name = '',
//     param = '',
// }){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    var app_fn_have = false;
    if (isAndroid) {

        if(window.android&&window.android[name])
        {
            app_fn_have = true;
            //对象存在，就执行这段代码


            // window.android.quit();//可行
            // window.android.quit('');//不可行
            // window.android['quit']();//可行
            // eval('window.android.quit()');//可行


            // return window.android[name](param);//不可行
            // return param?window.android[name](param):window.android[name]();//部分安卓不兼容

            // param= {a:123};
            // vant.Toast('window.android.'+name+'('+(param?JSON.stringify(param):'')+')');
            return eval('window.android.'+name+'('+(param?JSON.stringify(param):'')+')');
            
            // return true;
        }
    } else {
        if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers[name])
        {
            app_fn_have = true;
            //对象存在，就执行这段代码
            return window.webkit.messageHandlers[name].postMessage(param);
            // return true;
        }
    }

    if(!app_fn_have){
        //如果不存在
        // alert("没有 android."+name+" 对象");
        vant.Toast("没有 app 方法 " + name);
        return false;
    }
}
