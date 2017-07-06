var Page = {
	subpages: E.subpages,
	preloadPages: E.preloadPages,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig(), this.muiEvent()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			swipeBack: true,
			keyEventBind: {
				backbutton: false
			}
		});
		mui.plusReady(function() {
			mui('.mui-scroll-wrapper').scroll({
				indicators: true
			});
			self.ws = plus.webview.currentWebview();
			self = mui.extend(self, {
				loginPage: E.getWebview(self.subpages[4]),
				openr: self.ws.opener()
			})

		});
	},
	muiEvent: function() {
		var self = this;
		E.initDataurl("uid", function(uid) {
			E.showWebview(self.subpages[2]), E.hideWebview(self.subpages[0])
			self.openr.evalJS("Page.orderBack('" + uid + "')")
		});
		E.initDataurl("chartId", function(chartId, e) {
			E.openWindow("../chart/chart.html", {
				chartId: chartId
			})
		});
		E.initDataurl("type-url", function(url, e) {
			E.openWindow(url, {
				type: e.getAttribute("type")
			})
		})
		E.initDataurl("url", function(url) {
			E.openWindow(url)
		})
	},
	vueObj: {
		el: '#home',
		data: {
			homeData: {},
			yesData: {},
			op: "",
			hasClick: false,
			gongzhong:''
		},
		methods: {
			loadData: function() {
				if (mui("#item2mobile")[0].className.indexOf("mui-active") > 0) {
					var gallery = mui('.mui-slider').slider();
					gallery.gotoItem(-1);
				}
				var self = this;
				var params = E.systemParam("V5.mobile.order.status.count");
				E.getData('orderStatusCount', params, function(data) {
					console.log(JSON.stringify(data))
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.homeData = data;
					self.op = E.getStorage("op");
					E.setStorage("address", data.address);
					(data.unAccpetCount > 0 || data.acceptCount > 0) ? (Page.openr.evalJS("Page.addNavIcon(true)")) : (Page.openr.evalJS("Page.addNavIcon(false)"))
				}, "get");
				var param2 = E.systemParam("V5.mobile.order.yesterdayCount")
				console.log(JSON.stringify(param2))
				E.getData('yesterdayCount', param2, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.yesData = data.yesterdays;
				}, "get");
                var param3 = E.systemParam("V5.mobile.gongzhong.get")
				E.getData('gongzhongGet', param3, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					data.gongzhong.logo='http://open.weixin.qq.com/qr/code/?username='+data.gongzhong.appid;
					self.gongzhong = data.gongzhong;
				}, "get");

			},
			exitLogin: function() {
				Page.openr.hide("pop-out")
			},
			showWx: function() {
				this.hasClick = true;
			},
			closeWx: function() {
				this.hasClick = false;
			},
			goToloc: function() {
				E.openWindow("../map/location.html")
			},
			reloadStore: function(c) {
				var self = this
				E.confirm("是否修改门店地址", function() {
					var params = E.systemParam("V5.mobile.store.update");
					params = mui.extend(params, {
						warehouseId: self.homeData.warehouseId,
						address: c
					})
					E.showLoading()
					E.getData('storeUpdate', params, function(data) {
						E.closeLoading()
						if (!data.isSuccess) {
							var mapmsg = data.map.errorMsg;
							E.alert(data.map.errorMsg)
							return
						}
						self.homeData.address = c
					}, "get")
				})
			}
		}
	}

}
Page.init()