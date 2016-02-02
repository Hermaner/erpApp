mui.init({
	statusBarBackground: '#007aff',
	preloadPages: [{
		"id": "list/listdetail.html",
		"url": "list/listdetail.html",
	}, {
		"id": 'map/maps_map.html',
		"url": 'map/maps_map.html'
	}, {
		"id": "addnewitem.html",
		"url": "list/addnewitem.html",
	}, {
		"id": "calldetail.html",
		"url": "list/calldetail.html",
	}, {
		"id": "login.html",
		"url": "login.html",
	}, {
		"id": "pushSet",
		"url": "more/tongzhituisong.html",
	}]
});

var subpages = ['home2.html', 'item/items.html', 'list/dingdan.html', 'more/more.html'];
var subpage_style = {
	top: '0px',
	bottom: '50px'
};
var aniShow = {};
//创建子页面， 首个选项卡页面显示， 其它均隐藏；
mui.plusReady(function() {

	if (plus.storage.getItem("orgCode")) {
		var self = plus.webview.currentWebview();
		for (var i = 0; i < 4; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			if (i > 0) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
			self.append(sub);
		}
		loginFn();
		plus.navigator.closeSplashscreen();
	} else {
		plus.navigator.closeSplashscreen();
		mui.openWindow({
			id: "login.html",
			url: "login.html",
			waiting: {
				autoShow: false
			}
		})
	}
});
//当前激活选项
var activeTab = subpages[0];
//var title = document.getElementById("title");
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if (targetTab == activeTab) {
		return;
	}
	//更换标题
	//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	if (mui.os.ios || aniShow[targetTab]) {
		plus.webview.show(targetTab);
	} else {
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow, temp);
		plus.webview.show(targetTab, "fade-in", 300);
	}
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});

function orderlistback(uid) {
	var listPage = plus.webview.getWebviewById("list/dingdan.html");
	var nav_a0 = document.getElementsByClassName("mui-indxe-navfontcolor")[0].getElementsByTagName("a")[0];
	var nav_a2 = document.getElementsByClassName("mui-indxe-navfontcolor")[0].getElementsByTagName("a")[2];
	listPage.evalJS("getThisDate('" + uid + "',0,1)")
	nav_a0.setAttribute("class", "mui-tab-item");
	nav_a2.setAttribute("class", "mui-tab-item mui-active");
	activeTab = subpages[2];
}

function loginFn() { //点击登录判断
	var param = paramFn("V5.mobile.user.login");
	param.orgCode = plus.storage.getItem("orgCode")
	param.store = plus.storage.getItem("store")
	param.userName = plus.storage.getItem("account")
	param.password = plus.storage.getItem("password")
	param.appId = "商铺旺";
	param.cid = encodeURIComponent(plus.push.getClientInfo().clientid);
	param.phoneType = plus.os.name;
	dataSendFn('userLogin', param, function(data) {
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			mui.openWindow({
				id: "login.html",
				waiting: {
					autoShow: false
				}
			})
			console.log(mapmsg)
			return
		}

	}, "get")
}



//function getVersion() { //系统版本查询
//	var param = paramFn("V5.mobile.version.get");
//	dataSendFn('shopSearch', param, function(data) {
//		console.log("系统版本查询")
//		var url=plus.os.name=="ios"?"itunes":"apk";
//		var myVersion=data.version;
//		var newVersion=data.version;
//		if(myVersion!=newVersion){
//			plus.nativeUI.confirm("发现新版本，是否更新？", function(event){
//				if ( 0==event.index ) {
//					plus.runtime.openURL(url );
//				}
//			}, "", ["立即更新","取　　消"] );
//		}
//	}, 'get')
//}