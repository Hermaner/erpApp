mui.init({
	statusBarBackground: '#1F71B4',
});
var storename, openr, ws, loginstatus, openw;
mui.plusReady(function() {

	var shopname = document.getElementById("shopname");
	var shopno = document.getElementById("shopno");
	var account = document.getElementById("account");
	var password = document.getElementById("password");
	var login = document.getElementById("login");

	ws = plus.webview.currentWebview();
	openr = ws.opener();
	if (plus.storage.getItem("orgCode")) {
		shopname.value = plus.storage.getItem("orgCode")
		shopno.value = plus.storage.getItem("store")
		account.value = plus.storage.getItem("account")
		password.value = plus.storage.getItem("password")
	}
    var imei=plus.device.vendor;
    if(imei!='CipherLab'){
    	plus.storage.setItem("imei","1")
    }
    else{
    	plus.storage.setItem("imei","0")
    }
	loginstatus = 0;

	login.addEventListener("tap", function() {

		loginFn()

	})
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackTranslucent");
	var rh = plus.screen.resolutionHeight
	var aboutFoot = document.getElementById("about-foot")
	aboutFoot.style.top = (rh - 70) + "px";
	plus.navigator.closeSplashscreen();
	getVersion()
	var todaogou = document.getElementById("todaogou");
	var daogou = document.getElementById("daogou");
	var daogouclose = document.getElementById("daogouclose");
	todaogou.addEventListener("click", function() {
		daogou.style.display = "block";
	});
	daogouclose.addEventListener("tap", function() {
		daogou.style.display = "none";
	});


	document.getElementById("daogouphone").addEventListener('tap', function() {
		plus.nativeUI.confirm("是否拨打电话？", function(e) {

			if (e.index == 0) {
				plus.device.dial("4007285858");
			} else {
				return;
			}
		}, "", ["确认", "取消"]);
	});

})

function blurToast(e, a) { //失去焦点判断
	!e.value && plus.ui.toast(a, {
		duration: 200,
		verticalAlign: "top"
	});

}

function loginFn() { //点击登录判断
	if (loginstatus == 1) {
		return
	}
	loginstatus = 1
	var phonetype = plus.os.name.toLowerCase() //系统判断ios或安卓
	var param = paramFn("V5.mobile.user.login"); //登录接口，接口文档No.1
	param.orgCode = shopname.value;
	param.store = shopno.value;
	storename = param.store;
	param.userName = account.value;
	param.password = password.value;
	param.appId = plus.runtime.appid;

	if (phonetype == "ios") { //判断不同系统开启不同消息推送
		param.cid = encodeURIComponent(plus.push.getClientInfo().token)||"test";

	} else {
		param.cid = encodeURIComponent(plus.push.getClientInfo().clientid);

	}
	param.phoneType = phonetype;
	if (!shopname.value || !shopno.value || !account.value || !password.value) {
		loginstatus = 0
		plus.ui.toast("信息不全！", {
			duration: 200,
			verticalAlign: "top"
		});
		return false
	}
	plus.nativeUI.showWaiting("登录中...");
	dataSendFn('userLogin', param, function(data) { //登录接口
		if (!data.isSuccess) {
			console.log(JSON.stringify(data))
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			plus.nativeUI.closeWaiting()
			loginstatus = 0
			return
		}
		loginstatus = 0;
		plus.storage.setItem("orgCode", shopname.value);
		plus.storage.setItem("store", shopno.value);
		plus.storage.setItem("account", account.value);
		plus.storage.setItem("password", password.value);
		plus.storage.setItem("op", data.op);
		getList(function() { //获取店铺信息
			openr.evalJS("loadChild()")
			plus.runtime.setBadgeNumber(0);
			plus.webview.hide("login.html", "pop-out")
			plus.navigator.setStatusBarBackground("#007aff");
			if (mui.os.ios) {
				plus.webview.show('home2.html');
			} else {
				plus.webview.show('home2.html', "fade-in", 300);
			}
			plus.webview.hide('more/more.html');
			//更改当前活跃的选项卡
			var activeTab = 'home2.html';
			openr.evalJS("moreback()");
		})



	}, "get", erroeFN())
}

function erroeFN() {
	loginstatus = 0
}

function getList(callback) {
	var stroeparam = systemParam("V5.mobile.order.shop.search"); //店铺信息列表查询接口，接口文档No.15
	dataSendFn('shopSearch', stroeparam, function(data) { //获取店铺列表 
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			console.log(mapmsg)
			return
		}
		console.log("储存门店列表")
		plus.storage.setItem("shopsList", JSON.stringify(data.shops)); //添加店铺信息缓存
		getStoreList(callback)
	}, 'get')
}

function getStoreList(callback) { //门店列表查询接口，接口文档No.23 
	var stroeparam = systemParam("V5.mobile.allocate.warehouse.search");
	dataSendFn('warehouseSearch', stroeparam, function(data) {
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			console.log(mapmsg)
			return
		}
		data = data.stores
		console.log("储存门店列表")
		plus.storage.setItem("storesList", JSON.stringify(data)); //储存门店列表
		var status=0
		for (var i = 0; i < data.length; i++) {
			if (data[i].storeName == storename) {
				plus.storage.setItem("myAddress", data[i].address); //储存门店经纬度
				callback()
				status=1;
				break;
			}
		}
        if(!status){
        	plus.nativeUI.alert("门店列表中不存在此门店", function() {}, "", "OK");
        	plus.nativeUI.closeWaiting()
        }
	}, 'get')
}


function getVersion() { //系统版本查询
		var param = paramFn("V5.mobile.version.get");
		dataSendFn('versionGet', param, function(data) {
			var myVersion;
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				myVersion = inf.version;
				var newVersion = data.version;
				if (myVersion != newVersion) {
					plus.nativeUI.confirm("发现新资源，是否更新？", function(event) {
						if (0 == event.index) {
							downWgt()
						}
					}, "", ["立即更新", "取　　消"]);
				}
			});

		}, 'get')
	}
	// 下载wgt文件
var wgtUrl = "http://www.hongware.com/app/installwgt.wgt";
function downWgt() {
		plus.nativeUI.showWaiting("准备资源，请稍后...");
		var dtask = plus.downloader.createDownload(wgtUrl, {
			filename: "_doc/update/"
		}, function(d, status) {
			if (status == 200) {
				installWgt(d.filename); // 安装wgt包
			} else {
				plus.nativeUI.alert("下载失败！");
			}

		})
		dtask.addEventListener("statechanged", function(task, status) {
			switch (task.state) {
				case 1: // 开始
					break;
				case 2: // 已连接到服务器
				    plus.nativeUI.closeWaiting();
					var diver = document.createElement("div");
					diver.className = "progress-bg";
					diver.innerHTML = "<div class='progress-bar blue stripe'><span id='progressSpan' style='width:0'></span></div>";
					document.getElementsByTagName("body")[0].appendChild(diver);
					break;
				case 3: // 已接收到数据
					var progressSpan = document.getElementById("progressSpan")
					var progressPx = parseFloat(task.downloadedSize / task.totalSize) * 240 + "px";
					progressSpan.style.width = progressPx
					break;
				case 4: // 下载完成
					break;
			}
		});
		setTimeout(function() {
			dtask.start();
		}, 500)
	}
	// 更新应用资源

function installWgt(path) {
	plus.runtime.install(path, {}, function() {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("应用资源更新完成！", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("安装失败[" + e.code + "]：" + e.message);
	});
}