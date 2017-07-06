var Page = {
	ItemId: null,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			pullRefresh: {
				container: '#tochange',
				up: {
					contentdown: '上拉加载更多',
					contentrefresh: '正在刷新中...',
					callback: self.pullRefreshUp
				}
			}
		});
		mui('#tochange').on('tap', '.mui-radio', function() {
			var target = this.querySelector('input');
			var index = target.getAttribute('index')
			var status = target.checked
			for(var i = 0; i < self.vue.items.length; i++) {
				self.vue.items[i].status = false
			}
			self.vue.items[index].status = !status
		});
		mui.plusReady(function() {
			window.addEventListener('detailShow', function(event) {
				self.vue.mobilePhones = event.detail.telData;
				self.vue.loadData()
			})
			var oldBack = mui.back;
			mui.back = function() {
				self.ItemId = null
				self.vue.items = []
				self.vue.showData = true
				self.vue.noData = false
				oldBack()
			}
		});
	},
	pullRefreshUp: function() {
		Page.vue.loadData()
	},
	vueObj: {
		el: '#vue',
		data: {
			items: [],
			showData: true,
			noData: false,
			radioCur: '',
			tabtype: 0,
			mobilePhones: '',
		},
		methods: {
			loadData: function(d) {
				var self = this;
				if(d) {
					this.noData = false
					this.showData = true
					Page.ItemId = null;
					this.items = []
				}
				var params = E.systemParam('V5.mobile.coupon.info.search');
				params = mui.extend(params, {
					orderId: Page.ItemId || "",
					pageSize: 10,
					optype: "up",
					couponStatus: this.tabtype
				})
				E.getData('couponInfoSearch', params, function(data) {
					self.showData = false
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						mui('#tochange').pullRefresh().endPullupToRefresh(true);
						if(data.map.errorMsg == '没有更多的数据') {
							mui('#tochange').pullRefresh().disablePullupToRefresh()
							if(d) {
								self.noData = true
							} else {
								E.alert(data.map.errorMsg)
							}
						} else {
							E.alert(data.map.errorMsg)
						}
						return
					}
					
					self.noData = false
					d && (plus.os.name == "Android" ? (window.scrollTo(0, 0)) : (mui('#tochange').pullRefresh().scrollTo(0, 0)));
					var coupons = data.coupons;
					if(coupons.length==0){
						return
					}
					for(var i = 0, len = coupons.length; i < len; i++) {
						coupons[i].status = false
					}
					self.items = self.items.concat(coupons);
					Page.ItemId = coupons[coupons.length - 1].orderId;
					mui('#tochange').pullRefresh().endPullupToRefresh(false);
					if(coupons.length < 10) {
						mui('#tochange').pullRefresh().endPullupToRefresh(true)
					}
				}, "get")
			},
			gonext: function(c) {
				var couponId = ''
				for(var i = 0, len = this.items.length; i < len; i++) {
					if(this.items[i].status) {
						couponId = this.items[i].couponNumber;
						this.couponName = this.items[i].couponName
						this.couponUrl = this.items[i].couponCodeReceive
					}
				}

				if(!couponId) {
					mui.toast('请选择优惠劵')
					return
				}
				E.fireData('smsmodel', '', {
					couponId: couponId,
					mobilePhones: this.mobilePhones
				})
			},
			checkItem: function(c) {
				if(mui("button")[c].classList.contains('cur')) {
					return
				} else {
					mui("button.cur")[0].classList.remove("cur")
					mui("button")[c].classList.add("cur")
				}
				this.tabtype = c;
				this.loadData(1)
				mui('#tochange').pullRefresh().endPullupToRefresh(false);
				mui("#tochange").pullRefresh().refresh(true);
			},
			goback: function() {
				mui.back()
			},
			copyCoupon: function(c) {
				if(plus.os.name == "Android") {
					var Context = plus.android.importClass("android.content.Context");
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					plus.android.invoke(clip, "setText", c);
				} else {
					var UIPasteboard = plus.ios.importClass("UIPasteboard");
					//这步会有异常因为UIPasteboard是不允许init的，init的问题会在新版中修改
					var generalPasteboard = UIPasteboard.generalPasteboard();
					// 设置/获取文本内容:
					generalPasteboard.setValueforPasteboardType(c, "public.utf8-plain-text");
					var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
				}
				E.toast("复制成功")
			}
		}
	}

}
Page.init()