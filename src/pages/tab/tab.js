var Page = {
	subpages: E.subpages,
	activeTab: E.subpages[0],
	login: 0,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig(), this.muiEvent()
	},
	initConfig: function() {
		var self = this;
		mui.init({});
		mui.plusReady(function() {
			var ws = plus.webview.currentWebview();
			for(var i = 0, len = self.subpages.length; i < len; i++) {
				(function(arg) {
					var sub = plus.webview.create(self.subpages[arg], self.subpages[arg], {
						top: '0px',
						bottom: '50px'
					});
					switch(arg) {
						case 0:
							self.homePage = sub;
							break;
						case 1:
							self.goodsPage = sub;
							sub.hide();
							break;
						case 2:
							self.orderPage = sub;
							sub.hide();
							break;
						case 3:
							self.morePage = sub;
							sub.hide();
							break;
						default:

					}
					ws.append(sub);
				})(i);
			};
			var old_back = mui.back;
			mui.back = function() {
				if(confirm("确定退出吗？")) {
					plus.runtime.quit();
				}
			};
			plus.push.addEventListener("click", function(msg) {
				var payload = msg.payload;
				if(payload.payload) {
					return
				}
				E.confirm('有新订单，是否立即跳转？', function() {
					self.goToDetail(payload)
				})
			}, false);
			plus.push.addEventListener("receive", function(msg) {
				var payload = msg.payload;
				if(payload.payload) {
					return
				}
				E.confirm('有新订单，是否立即跳转？', function() {
					self.goToDetail(payload)
				})
			}, false);
			document.addEventListener("resume", function() {
				if(self.login == 1) {
					self.resumeEvent();
					E.getStorage("vendor")==0&&(self.loadWidgetConfig())

				}
			}, false);
		});
	},
	loadChild: function(c) {
		this.login = 1;
		this.homePage.evalJS("Page.vue.loadData()");
		mui.preload({
			id: 'orderDetail',
			url: '../order/orderDetail.html',
		})
		mui.preload({
			id: 'pushSet',
			url: '../more/pushSet.html',
		})
		E.getWebview(E.preloadPages[1]).evalJS("pushPage.loadData()");
		c && c != 0 && (this.loadWidgetConfig(c))
	},
	resumeEvent: function() {
		plus.runtime.setBadgeNumber(0);
		var url = mui(".mui-active")[0].getAttribute('data-href');

		this.loadEvent(url)
	},
	muiEvent: function() {
		var self = this
		mui("[data-href]").each(function() {
			this.addEventListener("tap", function() {
				var url = this.getAttribute("data-href");
				if(url == self.activeTab) return;
				self.loadEvent(url)
				E.showWebview(url), E.hideWebview(self.activeTab), self.activeTab = url;
			})
		})
	},
	loadEvent: function(c) {
		E.showLoading();
		switch(c) {
			case this.subpages[0]:
				this.homePage.evalJS("Page.vue.loadData()")
				break;
			case this.subpages[1]:
				this.goodsPage.evalJS("Page.vue.loadData('',1)")
				break;
			case this.subpages[2]:
				this.orderPage.evalJS("Page.vue.loadData('','',1)")
				break;
			default:
				E.closeLoading()
				break;
		}
	},
	goToDetail: function(c) {
		E.fireData(E.preloadPages[0], 'detailShow', {
			orderNumber: c
		})
	},
	addNavIcon: function(c) {
		this.vue.hasCount = c
	},
	orderBack: function(c) {
		E.showLoading()
		this.orderPage.evalJS("Page.vue.loadData('" + c + "','',1)");
		mui("a")[0].classList.remove("mui-active")
		mui("a")[2].classList.add("mui-active")
		this.activeTab = this.subpages[2];
	},
	moreBack: function() {
		mui("a")[3].classList.remove("mui-active")
		mui("a")[0].classList.add("mui-active")
		E.showWebview(this.subpages[0]), E.hideWebview(this.subpages[3])
		this.activeTab = this.subpages[0];
	},
	vueObj: {
		el: '#vue',
		data: {
			hasCount: false
		}
	},
	loadWidgetConfig: function(c) {
		// 获取类的静态常量属性
		var config = plus.android.newObject("io.dcloud.widget.WidgetTurnConifg");
		var pageType = c || plus.android.getAttribute(config, "type");
		//根据type类型来加载不同的页面
		//启动页面 1：商铺旺，2：商品盘点，3：商品入库，4：定位订单，5：门店收银
		//clicked('about.html','zoom-fade-out',true)
		var htmlName, type = '';
		plus.android.setAttribute( config, "type", 0);
		if(pageType == 1) {} else if(pageType == 2) {
			if(plus.webview.getTopWebview().getURL().indexOf('goodsAction.html') > 0) {
				return
			}
			htmlName = "../goodsAction/goodsAction.html";
			type = "check"
		} else if(pageType == 3) {
			if(plus.webview.getTopWebview().getURL().indexOf('goodsActions.html') > 0) {
				return
			}
			htmlName = "../goodsAction/goodsActions.html";
			type = "storage"
		} else if(pageType == 4) {
			if(plus.webview.getTopWebview().getURL().indexOf('orderScan.html') > 0) {
				return
			}
			htmlName = "../barcode/orderScan.html";
		} else if(pageType == 5) {
			console.log(plus.webview.getTopWebview().getURL())
			if(plus.webview.getTopWebview().getURL().indexOf('cashrCart.html') > 0 || plus.webview.getTopWebview().getURL().indexOf('cashrDetail.html') > 0) {
				return
			}
			htmlName = "../cashr/cashrCart.html";
		}
		if(pageType && pageType != 0&&htmlName) {
			E.openWindow(htmlName, {
				type: type
			})
			setTimeout(function() {
				if(E.getWebview('../goodsAction/goodsAction.html')&&pageType!=2) {
					E.hideWebview("../goodsAction/goodsAction.html")
					E.closeWebview('../goodsAction/goodsAction.html')
				} else if(E.getWebview('../goodsAction/goodsActions.html')&&pageType!=3) {
					E.hideWebview("../goodsAction/goodsActions.html")
					E.closeWebview('../goodsAction/goodsActions.html')
				} else if(E.getWebview('../barcode/orderScan.html')&&pageType!=4) {
					E.hideWebview("../barcode/orderScan.html")
					E.closeWebview('../barcode/orderScan.html')
				} else if(E.getWebview('../cashr/cashrCart.html')&&pageType!=5) {
					E.hideWebview("../cashr/cashrCart.html")
					E.closeWebview('../cashr/cashrCart.html')
				}
			},1000)

		}

	}
};

Page.init()