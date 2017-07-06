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
	},
	vueObj: {
		el: '#home',
		data: {
			homeData: {},
			op: "",
			hasClick: false,
			moreList: [],
			gongzhong: '',
			exit1: '',
			exit2: '',
			exit4: '',
			exit5: '',
			exit7: '',
			exit8: '',
			exit9: '',
			exit10: '',
			exit11: '',
			exit12: '',
			exit13: '',
			exit14: '',
			exit15: '',
			exit16: '',
		},
		methods: {
			loadData: function() {
				var self = this;
				mui.plusReady(function() {
					var params = E.systemParam("V5.mobile.order.status.count");
					E.getData('orderStatusCount', params, function(data) {
						console.log(JSON.stringify(data))
						if(!data.isSuccess) {
							E.closeLoading()
							E.alert(data.map.errorMsg)
							return
						}
						self.homeData = data;
						self.op = E.getStorage("op");
						E.setStorage("address", data.address);
						(data.unAccpetCount > 0 || data.acceptCount > 0) ? (Page.openr.evalJS("Page.addNavIcon(true)")) : (Page.openr.evalJS("Page.addNavIcon(false)"))

					}, "get");
					self.loadList()
					self.loadGongzhong()
				})

			},
			loadGongzhong: function() {
				var self = this
				var params = E.systemParam("V5.mobile.gongzhong.get")
				E.getData('gongzhongGet', params, function(data) {
					console.log(data)
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					data.gongzhong.logo = 'http://open.weixin.qq.com/qr/code/?username=' + data.gongzhong.appid;
					self.gongzhong = data.gongzhong;
					E.setStorage('logo', data.gongzhong.image)
				}, "get");
			},
			loadList: function() {
				var self = this
				var params = E.systemParam("V5.mobile.permission.function.search")
				E.getData('permissionFunctionSearch', params, function(data) {
					console.log(data)
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}

					var functionData = JSON.parse(data.functionData)
					console.log(functionData)
					var moreList = []
					for(var i = 0; i < functionData.length; i++) {
						if(functionData[i].moduleStatus != 1) {
							moreList.push(functionData[i].moduleId)
						}
						switch(functionData[i].moduleId) {
							case '1':
								self.exit1 = functionData[i].moduleStatus
								break;
							case '2':
								self.exit2 = functionData[i].moduleStatus
								break;
							case '4':
								self.exit4 = functionData[i].moduleStatus
								break;
							case '5':
								self.exit5 = functionData[i].moduleStatus
								break;
							case '7':
								self.exit7 = functionData[i].moduleStatus
								break;
							case '8':
								self.exit8 = functionData[i].moduleStatus
								break;
							case '9':
								self.exit9 = functionData[i].moduleStatus
								break;
							case '10':
								self.exit10 = functionData[i].moduleStatus
								break;
							case '11':
								self.exit11 = functionData[i].moduleStatus
								break;
							case '12':
								self.exit12 = functionData[i].moduleStatus
								break;
							case '13':
								self.exit13 = functionData[i].moduleStatus
								break;
							case '14':
								self.exit14 = functionData[i].moduleStatus
								break;
							case '15':
								self.exit15 = functionData[i].moduleStatus
								break;
							case '16':
								self.exit16 = functionData[i].moduleStatus
								break;
							default:
								break
						}
					}
					self.moreList = moreList

				}, "get");
			},
			goPage: function(url, type) {
				switch(url) {
					case '../createVip/createVip.html':
						E.openPreWindow('createVip')
						break;
					case 'moreList.html':
						E.openWindow('moreList.html', {
							moreList: this.moreList
						})
						break;
					default:
						E.openWindow(url, {
							type: type ? type : ''
						})
						break;
				}
			},
			exitLogin: function() {
				Page.openr.hide("pop-out")
			},
			showWx: function() {
				if(this.gongzhong.image.length>0){
					this.hasClick = true;
				}
				
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
						if(!data.isSuccess) {
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