//使用惰性思想(JS高级编程技巧之一)来封装我们的常用方法库：在第一次给utils赋值的时候，已经把兼容给处理好了，把最后的结果存放在flag变量中，以后在每一个方法中，只要是IE6-8不兼容的，我们不需要重复验证,只需要使用flag的值即可。
var tools = (function () {
	var flag = "getComputedStyle" in window;
	
	//将一个类数组或数组转换成数组的格式
	function listToArray(likeArr) {
			var arr = [];
			try {
				arr = Array.prototype.slice.call(likeArr,0);
				//IE9-8下不兼容dom元素的集合
			} catch (e) {
				for (var i = 0;i < likeArr.length; i ++) {
					arr[arr.length] = likeArr[i];
				}
			}
			return arr;
		}
	
	//获取当前元素(curEle)下所有的元素子节点(兼容所有浏览器)，如果传递了target,可以在获取集合中进行二次筛选，把指定的标签名target获取到
	function children(curEle,target) {
		var arr = [];
		//IE6-8不能使用内置的children属性，自己写代码实现
		if (/MISE (6|7|8)/i.test(navigator.userAgent)) {
			var nodeList = curEle.childNodes;
			var len = nodeList.length;
			for (var i = 0; i < len; i ++) {
				if (nodeList[i].nodeType === 1) {
					arr[arr.length] = nodeList[i];
				}
			}
		} else {
			//标准浏览器中，我们直接使用children即可，但是这样获取到的是一个元素集合(类数组)，为了与IE上的数组保持一致，实现把类数组转换成数组
			arr = Array.prototype.slice.call(curEle.children);//arr = this.listToArray(curEle.children)
		}
		//二次筛选
		if (typeof(target) === 'string') { //如果输入了第二个参数，则继续判断
			for (var k = 0; k < arr.length; k ++) {
				var curEleNode = arr[k];
				if (curEleNode.nodeName.toLowerCase() !== target.toLowerCase()) {
					//不是我想要的标签
					arr.splice(k,1);
					k--;//后面元素向前移，所以索引减1
				}
			}
		}
		return arr;
	 }
	
	//获取当前元素(curEle)上一个哥哥元素节点
	function prev(curEle) {
		if (flag) {
			return curEle.previousElementSibling;
		}
		var pre = curEle.previousSibling;
		while(pre && pre.nodeType !== 1) {
			pre = pre.previousSibling;
		}
		return pre;
	}
	
	//next：获取当前元素(curEle)下一个弟弟元素节点
	function next(curEle) {
		if (flag) {
			return curEle.nextElementSibling;
		}
		var next = curEle.nextSibling;
		while(next && next.nodeType !== 1) {
			next = next.nextSibling;
		}
		return next;
	}
	
	//获取当前元素(curEle)所有的哥哥元素节点
	function prevAll(curEle) {
		var arr = [];
		var pre = this.prev(curEle);//prev(curEle)
		while(pre) {
			arr.unshift(pre);//将每一次加进来的元素节点放在数组的第一位
			pre = this.prev(pre);
		}
		return arr;
	}
	
	//nextAll:获取当前元素(curEle)所有的弟弟节点
	function nextAll(curEle) {
		var next = this.next(curEle);
		var arr = [];
		while(next) {
			arr.push(next);
			next = this.next(next);
		}
		return arr;
	}
	
	//sibling:获取当前元素(curEle)相邻的两个元素节点,返回一个数组，第一位表示前一个元素节点，第二位表示后一个元素节点。若不存在则显示null
	function sibling(curEle) {
		var prev = this.prev(curEle);
		var next = this.next(curEle);
		var arr = [];
		//prev ? arr.push(prev) : null;
		//next ? arr.push(next) : null;
		arr.push(prev);
		arr.push(next);
		return arr;
	}
	
	//siblings：获取当前元素(curEle)所有的兄弟元素节点,返回一个数组
	function siblings(curEle) {
		//var prevAll = this.prevAll(curEle);
		//var nextAll = this.nextAll(curEle);
		//return prevAll.concat(nextAll);
		return this.prevAll(curEle).concat(this.nextAll(curEle));
	}
	
	//index：当前元素(curEle)在同级元素中的索引是多少	
	function index(curEle) {
		return (this.prevAll(curEle).length);
	}
	
	//firstChild：获取当前元素(curEle)的第一个元素子节点
	function firstChild(curEle) {
		var childs = this.children(curEle);
		return childs.length > 0 ? childs[0] : null;
	}

	//lastChild：获取当前元素(curEle)最后一个元素子节点
	function lastChild(curEle) {
		var childs = this.children(curEle);
		return childs.length > 0 ? childs[childs.length - 1] : null;
	}
	
	//append：向指定父级元素(parentNode)的末尾追加元素子节点(newEle)
	function append(newEle,parentNode) {
		parentNode.appendChild(newEle);
	}
	
	//preppend：向指定父级元素(parentNode)的开头增加元素子节点(newEle)
	//即在第一个元素子节点之前增加一个元素节点
	function prepend(newEle,parentNode) {
		var firstElementNode = this.firstChild(parentNode);
		if (firstElementNode) {
			parentNode.insertBefore(newEle,firstElementNode);
			return ;
		}
		parentNode.appendChild(newEle);
	}
	
	//insertBefore:把目标元素(targetElement)追加到源元素(originElement)的前面
	function insertBefore(targetElement,originElement) {
		origin.parentNode.insertBefore(targetElement,originElement);
	}
	
	//insertAfter：把目标元素(targetElement)追加到源元素(originElement)的后面
	function insertAfter(targetElement,originElement) {
		var nextElementSibling = origin.nextElementSibling;//this.next(origin);
		if (nextElementNode) {
			this.insertBefore(targetElement,nextElementSibling);
			return ;
		} else {
			origin.parentNode.appendChild(targetElemeng);//如果弟弟元素节点不存在，也就表示当前元素是最后一个元素子节点，我们把新的元素放在最末尾即可
		}
	}
	
	//addClass:增加当前元素(curEle)的样式类名(className,字符串形式)。可以写多个类名，类名间以空格隔开
	function addClass(curEle,className) {
		//为了防止className传递进来的值包含多个样式类名，我们先传递进来的字符串去除首尾的空格，再把传递进来的字符串按照一到多个空格拆分成数组中的每一项
		var arr = className.replace(/(^ +| +$)/g,"").split(/ +/g);
		for (var i = 0, len = arr.length; i < len; i++) {
			if (!(this.hasClass(curEle,arr[i]))) {
			curEle.className = " " + className;
		}
		}	
	}
	
	//removeClass:移除当前元素(curEle)的样式类名(className,字符串形式)。可以写多个类名，类名间以空格隔开
	function removeClass(curEle,className) {
		var arr = className.replace(/(^ +| +$)/g,"").split(/ +/g);
		for (var i = 0,len = arr.length; i < len; i++) {//循环数组，一项项移除即可
			var curName = arr[i];
			if (this.hasClass(curEle,curName)) {
				var reg = new RegExp("(^| +)" + curName + "$| +","g");
				curEle.className = curEle.className.replace(reg," ");
			}
		}
	}
	
	//hasClass:判断当前元素(curEle)的是否存在样式类名(className,字符串形式)。
	function hasClass(curEle,className) {
		var reg = new RegExp("(^| +)" + className + "( +|$)");
		return reg.test(curEle.className)
	}
	
	//获得指定上下文context中含有类名为className的所有元素标签
	function getElementsByClassName(className,context) {
			context = context || document;
			if (flag) {
				var arr = this.listToArray(context.getElementsByClassName(className));
				return arr;
			}
			var arr = [];
			var classNameArr = className.replace(/(^ +| +$)/g,"").split(/ +/g);
			//获取指定上下文中的所有元素标签，循环这些标签，获取每一个标签的className样式类名的字符串
			var nodeList = context.getElementsByTagName("*");
			for (var i = 0,len = nodeList.length; i < len; i++) {
				var curEle = nodeList[i];
				var _isOk = true;
				//判断当前元素是否包含数组classNameArr里的所有类名
				for (var k = 0; k < classNameArr.length; k++) {
					var curName = classNameArr[k];
					if (!(tools.hasClass(curEle,curName))) {
						_isOk = false;
						break;
					}
				}
				if (_isOk) {
					arr.push(curEle);
				}
			}
			return arr;
		}
	
	//获取当前元素(curEle)的特定CSS样式(attr)
	function getCss(attr) {
		var val = null;
		if (window.getComputedStyle) {
			val = window.getComputedStyle(this,null)[attr];
		} else if (attr == "opacity") {
			val = this.currentStyle['filter'];
			var reg = /^alpha\(opacity=(\d+(?=\.\d)?)\)/;
			val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
		} else {
			val = this.currentStyle[attr];
		}
		//把获取到的样式值的单位去掉，以便后续操作。只有符合"数字+单位/数字"的才执行此操作
		var reg = /(^-?\d+(\.\d)?)(px|pt|rem|em)?$/;
		val = reg.test(val) ? parseFloat(val) : val;
		return val;
	}
	
	//给当前元素(curEle)的某个样式(attr)的属性值(value).(增加在行内样式上)
	function setCss(attr,value) {
		if (attr === "opicaty") {
			//如果设置的是透明度，我们需要设置两套样式来兼容所有浏览器
			this[style][opacity] = value;
			this[style][filter] = "alpha(opacity=" + value*100 + ")";	
			return ;
		}
		if (attr === "float") {
			//在js中设置float也需要处理兼容
			this[style]["float"] = value;
			this[style]["styleFloat"] = value;
			return ;
		}
		//对于某些样式值，如果传递进来没有单位，我们就需要自动把单位默认的补充上，这样的话就更加人性化
		var reg = /^(width|height|top|bottom|left|right|((marggin|padding)(Top|Left|Bottom|Right)?))$/;
		if (reg.test(attr)) {
			if (!isNaN(value)) {
				value = value + "px";
			}
		}
		this[style][attr] = value;
	}
	
	//批量的设置当前元素(curEle)的样式值(option为一个样式对象)
	function setGroupCss(options) {
		if (Object.prototype.toString.call(options) !== "[object Object]") {
			return ;
		}
		for (key in options) {
			if (options.hasOwnProperty(key)) {
				setCss(this,key,options[key]);
			}
		}
	}
	
	//获取 单独设置 批量设置当前元素(curEle)的样式值
	function css(curEle) {
		var argTwo = arguments[1],arr = Array.prototype.slice.call(arguments,1);
		if (typeof(argTwo) === "string") {
		//这个参数是一个字符串，这样的话有可能就是在获取样式；为什么说是有可能呢？因为还需要判断是否存在第三个参数，如果第三个参数存在，就不是获取样式，而是单独设置样式。
			var argThree = arguments[2];
			if (!argThree) { //第三个参数不存在
				return getCss.apply(curEle,arr);//为了方便，可以把整个arr直接传递进去
			} else {
				return setCss.apply(curEle,arr);
			}
		}
		if (Object.prototype.toString.call(argTwo) === "[objec Object]") {
			setGroupCss.apply(curEle,arr);
		}
	}
	
	//获取和设置浏览器窗口本身属性的方法
	function win(attr,value) {
		if (value == undefined) { 	//获取浏览器属性
			return document.documentElement[attr] || document.body[attr];
		}
		document.documentElement[attr] = value;
		document.body[attr] = value;
	}
	
	//获取页面中任意一个元素(curEle)距离body的偏移量。函数的返回值是一个对象{left:totalLeft , top:totalTop};
	function offset(curEle) {
		var totalLeft = null,totalTop = null,par = curEle.offsetParent;
		totalLeft = curEle.offsetLeft;
		totalTop = curEle.offsetTop;
		//如果没有找到body,就把父级参照物的边框和偏移也累加
		while(par) {
			if (navigator.userAgent.indexOf('MSIE 8.0')===-1) {
			//在IE8浏览器中，offsetLeft / offsetTop 是元素本身的外边框距离父级元素外边框的距离
			//如果是标准浏览器，则加上元素本身的边框
			//父级参照物的边框
			totalLeft += par.clientLeft;
			totalLeft += par.clientTop;
			}
			//父级参照物的偏移
			totalLeft += par.offsetLeft;
			totalTop += par.offsetTop;
			par = par.offsetParent;
		}
		return {left:totalLeft , top:totalTop};
	}

	
	return {
		listToArray : listToArray,
		children : children,
		prev : prev,
		next : next,
		prevAll : prevAll,
		nextAll : nextAll,
		sibling : sibling,
		siblings : siblings,
		index : index,
		firstChild : firstChild,
		lastChild : lastChild,
		append : append,
		prepend : prepend,
		insertBefore : insertBefore,
		insertAfter : insertAfter,
		addClass : addClass,
		removeClass : removeClass,
		hasClass : hasClass,
		getElementsByClassName : getElementsByClassName,
		getCss : getCss,
		setCss : setCss,
		setGroupCss : setGroupCss,
		css : css,
		win : win,
		offset : offset,
		
	}
		
})()