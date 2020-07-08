console.log('wjw_com.js console.log');

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


/** 补零
* 自定义函数名：PrefixZero
* @param num： 被操作数
* @param n： 固定的总位数
*/
function PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

//毫数转格式 【yyyy-MM-dd】 
// alert(format(1396178344662, 'yyyy-MM-dd HH:mm:ss')); 
function format(time, formats) {
    formats||(formats='');
    var t = time?new Date(time):new Date();
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return formats.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
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

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
function formatSeconds(value, formats) {
    var theTime = parseInt(value); // 需要转换的时间秒 
    var theTime1 = 0; // 分 
    var theTime2 = 0; // 小时 
    var theTime3 = 0; // 天
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
            if (theTime2 > 24) {
                //大于24小时
                theTime3 = parseInt(theTime2 / 24);
                theTime2 = parseInt(theTime2 % 24);
            }
        }
    }
    var result = '';
    // var yyyy , MM , dd , HH , mm , ss;
    var yyyy = MM = dd = HH = mm = ss = 0;
    // if (theTime > 0) {
        ss =  PrefixZero (parseInt(theTime),2);
        result = "" + ss  + "秒";
    // }
    if (theTime1 > 0) {
        mm = PrefixZero (parseInt(theTime1),2);
        result = "" + mm + "分" + result;
    }
    if (theTime2 > 0) {
        HH = PrefixZero (parseInt(theTime2), 2);
        result = "" + HH + "小时" + result;
    }
    if (theTime3 > 0) {
        dd = PrefixZero (parseInt(theTime3), 2);
        result = "" + dd + "天" + result;
    }
    if(formats){
        return formats.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
            console.log('result.replace', arguments);
            switch (a) {
                case 'yyyy':
                    console.log('yyyy', a);
                    return yyyy;
                    break;
                case 'MM':
                    console.log('MM', a);
                    return MM;
                    break;
                case 'mm':
                    console.log('mm', a);
                    return mm;
                    break;
                case 'dd':
                    console.log('dd', a);
                    return dd;
                    break;
                case 'HH':
                    console.log('HH', a);
                    return HH;
                    break;
                case 'ss':
                    console.log('ss', a);
                    return ss;
                    break;
            };
        });
    }else{
        return result;
    }
}


// 判断当前“时 : 分”是否在一天中某一区间内
// checkAuditTime("12:00", "13:00") 
function checkAuditTime(beginTime, endTime) {
    var nowDate = new Date();
    var beginDate = new Date(nowDate);
    var endDate = new Date(nowDate);

    var beginIndex = beginTime.lastIndexOf("\:");
    var beginHour = beginTime.substring(0, beginIndex);
    var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
    beginDate.setHours(beginHour, beginMinue, 0, 0);

    var endIndex = endTime.lastIndexOf("\:");
    var endHour = endTime.substring(0, endIndex);
    var endMinue = endTime.substring(endIndex + 1, endTime.length);
    endDate.setHours(endHour, endMinue, 0, 0);
    if (nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime()) {
        return true;
    } else {
        return false;
    }
}