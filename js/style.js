//第一步：实现首屏的瀑布流排列
    // 1、固定每一张图片的宽度，计算一行能够放几张图片
    // 2、循环所有图片，当图片到第二行时，计算每一列图片的高度，把图片放到高度最小的那一列上

    // 把一张图片放到对应的位置所需要的步骤
    //     1、计算那一列的高度最小
    //     2、把对应的图片放到那一列
    //     3、更新每一列的高度

window.onload = function () {
    var parent = document.getElementById("main"),
    target = document.getElementsByClassName("box"),
    targetWidth = target[0].offsetWidth,    //计算每一列的宽度
    dataImg = {"data":[{"src":"images/1.jpg"}]};
    len = dataImg.data.length;
    arrHeight = []; //存放每一列高度的数组
    cols = parseInt(document.documentElement.clientWidth / targetWidth);
    parent.len = target.length; //将图片的总数赋值给parent的len属性
    setTimeout(function () {    //进入网页1秒后加载首屏的内容
        for (var i = 0; i < cols; i++) {
            parent.lastIndex = i;   //将最后一张图片的索引赋值给parent的属性lastIndex.
            arrHeight.push(target[i].offsetHeight);
            fadeIn(target[i]);
        }
        waterfall(parent.lastIndex,parent.len);
    },500);

    window.onscroll = function () { //鼠标滚动事件
        var parent = document.getElementById("main"),
            target = document.getElementsByClassName("box");
        parent.len = target.length;
        var flag = check(arrHeight);
        //console.log(flag);
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
            waterfall(parent.lastIndex,parent.len);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        
        }
    }
    
    //图片加载时渐现效果
    function fadeIn(curEle) {
        var duration = 1000,
            target = 1,
            interval = 100,
            step = interval / duration * target; 
        var timer = setInterval(function () {
            var curOpa = tools.css(curEle,'opacity');
            if (curOpa > 1) {
                curEle.style.opacity = 1;
                clearInterval(timer);
            }
            curEle.style.opacity = step + curOpa
        },interval);
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

    //实现指定容器里的图片的瀑布流排列,parent代表父容器，target存放图片的容器
    function waterfall(lastIndex,length) {
        for (var i = lastIndex + 1; i < length; i++) {
            minHeight = Math.min.apply(null,arrHeight);
            var minHeightIndex = index(arrHeight,minHeight);
            target[i].style.position = "absolute";
            target[i].style.left = minHeightIndex * targetWidth + "px";
            target[i].style.top = minHeight + "px";
            fadeIn(target[i]);
            arrHeight[minHeightIndex] += target[i].offsetHeight;
            //console.log(minHeight);
            //console.log( minHeightIndex * targetWidth + "px");
            parent.lastIndex = i;
            console.log(i);
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



    //封装一个检测图片是否具备加载条件的函数
    function check(arrHeight) {
        var scrollTop = document.documentElement.scrollTop,//浏览器卷去的高度
            clientHeight = document.documentElement.clientHeight;//可视窗口的高度
            maxHeight = Math.max.apply(null,arrHeight) - 100;
        //console.log("a:"+ maxHeight); 
        //console.log("b:" + (scrollTop + clientHeight));    
        var flag = (maxHeight < scrollTop + clientHeight) ? true : false;
        return flag;
    }

}