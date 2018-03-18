

window.onload = function () {
    var dataImg = {"data":[{"src":"images/1.jpg"}]};
    len = dataImg.data.length;
    waterfall("main","box");
    window.onscroll = function () {
        var flag = check();
        if (flag) {
            for (var i = 0; i < len; i++) {
                var newBox = document.createElement("div"),
                    parent = document.getElementById("main"),
                    newImg = document.createElement("img"),
                    newPic = document.createElement("div");
                newBox.className = "box";
                newPic.className = "pic";
                newImg.src = dataImg.data[i].src;
                newPic.appendChild(newImg);
                newBox.appendChild(newPic);
                parent.appendChild(newBox);
            }
            waterfall("main","box");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        
        }
    }
   
    
    
}

//获取第一行的高度


//实现图片的瀑布流排列
function waterfall (par,tar) {
    var parent = document.getElementById(par),
        target = getElementsByClassName(tar,parent),
        targetLength = target.length,   //图片的总数
        targetWidth = target[0].offsetWidth,    //每一列的宽度
        heightArr = [], //存放每一列图片高度的数组
        cols = parseInt(document.documentElement.clientWidth / targetWidth);    //一屏可以放多少列
    for (var i = 0; i < targetLength; i++) {
        var curEle = target[i];     //当前操作的元素
        if (i < cols) {
            heightArr.push(curEle.offsetHeight);
        } else {
            var minHeight = Math.min.apply(null,heightArr),
                minindex = index(heightArr,minHeight);
            curEle.style.position = "absolute";
            curEle.style.top = minHeight + 'px';
            curEle.style.left = minindex*targetWidth + 'px';
            heightArr[minindex] += curEle.offsetHeight;
        }
    }
}

//封装一个兼容IE8以下浏览器的getElementsBtClassName方法
function getElementsByClassName(className,context) {
    context = context || document;
    if (document.getElementsByClassName) {
        //将类数组转换为数组
        arrList = Array.prototype.slice.call(context.getElementsByClassName(className));
        return arrList;
    }
    var nodeList = document.getElementsByTagName("*"),
        arrList = [],
        len = nodeList.length;
    for (var i = 0;i < len; i++) {
        var curEle = nodeList[i];
        if (curEle.className == className) {
            arrList.push(curEle);
        }
    }
    return arrList;

}

//封装一个获取数组中元素索引的函数
function index(arr,num) {
    var len = arr.length;
    for(var i = 0; i < len; i ++) {
        if (arr[i] == num) {
            return i;
        }
    }
}

//封装一个检测图片是否具备加载条件的函数
function check() {
    var parent = document.getElementById("main"),
        picList = getElementsByClassName('box',parent),//获取图片列表
        lastPic = picList[picList.length - 1],//获取显示的最后一张图片
        lastOffsetHeight = lastPic.offsetTop + parseInt(lastPic.offsetHeight/2),//最后一张图片距离body顶端的距离
        scrollTop = document.documentElement.scrollTop,//浏览器卷去的高度
        clientHeight = document.documentElement.clientHeight;//可视窗口的高度
    console.log("a:"+lastOffsetHeight); 
    console.log("b:" + (scrollTop + clientHeight));    
    var fla = (lastOffsetHeight < scrollTop + clientHeight) ? true : false;
    return fla;
}