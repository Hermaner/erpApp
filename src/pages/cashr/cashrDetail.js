var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig(), this.muiEvent()
	},
	initConfig: function() {
		var self = this;
		mui.init();
		mui.plusReady(function() {
			mui('.mui-scroll-wrapper').scroll();
			self.orderListPage = E.getWebview(E.subpages[2]);
			window.addEventListener('detailShow', function(event) {
				self.vue.items = event.detail.data;
				self.vue.$set('store', E.getStorage("store"))
				self.vue.$set('op', E.getStorage("op"))
				self.vue.$set('thisData', (new Date()).Format("yyyy-MM-dd hh:mm:ss"))
				self.vue.loadpayType()
			})
			E.getStorage("vendor") == 0 && (self.vue.registerCashierReceiver())
		})
		var old_back = mui.back;
		mui.back = function() {
			plus.webview.currentWebview().hide("pop-out")
			self.vue.configInit();
			self.vue.payments = [];
			self.vue.coupon = 0;
			self.vue.fee = 0;
			self.vue.denomination = 0;
			self.vue.discount = 10;
			self.vue.giveGoods = false;
			self.vue.showCardpay = false;
			self.vue.giveGoodsContent = [];
			self.vue.giveUrl = "";
			self.vue.erpMemo = "";
			self.vue.memberMsg = null;
			self.vue.memberDiscount = 1;
			mui('#dispatchPopover').popover('hide');
			mui('#payPopover').popover('hide');
			mui('#discountPopover').popover('hide');
		}
	},
	muiEvent: function() {
		var self = this
		E.initDataurl("sendId", function(sendId) {
			mui('#dispatchPopover').popover('hide');
			mui("#dispatchPopover")[0].removeAttribute("style")
			if(sendId == "SINCE") {
				self.vue.fee = 0;
				self.vue.sendType = sendId;
				self.vue.addressObj = null
			} else if(sendId == "STORE_DELIVER") {
				E.openWindow("getAddress.html", {
					sendId: sendId,
					tel: self.vue.memberMsg ? self.vue.memberMsg.mobilePhone : ""
				})
			} else {
				E.openWindow("getAddress.html", {
					sendId: sendId,
					tel: self.vue.memberMsg ? self.vue.memberMsg.mobilePhone : ""
				})
			}

		})
		mui("#payPopover").on('tap', "li", function() {
			var pid = this.getAttribute("pid");
			mui("#payPopover")[0].removeAttribute("style")
			mui('#payPopover').popover('hide');
			self.vue.createOrder(pid)

		})

	},
	getFee: function(c) {
		var self = this
		var params = E.systemParam("V5.mobile.freight.get");
		params.type = c;
		E.getData('freightGet', params, function(data) {
			if(!data.isSuccess) {
				E.alert(data.map.errorMsg)
				return
			}
			self.vue.fee = (data.freight).freightFee
		}, "get")
	},
	getCoupon: function(c) {
		var self = this
		var params = E.systemParam("V5.mobile.freight.get");
		params.type = c;
		E.getData('freightGet', params, function(data) {
			if(!data.isSuccess) {
				E.alert(data.map.errorMsg)
				return
			}
			self.vue.fee = (data.freight).freightFee
		}, "get")
	},
	vueObj: {
		el: '#cashrDetail',
		data: {
			items: [],
			fee: 0,
			sendType: "SINCE",
			couponName: "",
			orderNumber: "",
			coupon: 0,
			coupons: 0,
			denomination: 0,
			discount: 10,
			giveGoods: false,
			giveGoodsContent: [],
			cardType: '',
			giveUrl: "",
			oldcoupon: 0,
			couponCode: "",
			erpMemo: "",
			addressObj: null,
			memberMsg: false,
			showCardpay: false,
			payPopoverShow: false,
			memberCardNumber: "",
			password: "",
			memberDiscount: 1,
			fullRoleName: "",
			fullRoleshow: false,
			fullRoles: [{
				"full": "100",
				"cut": "20"
			}, {
				"full": "200",
				"cut": "40"
			}, {
				"full": "300",
				"cut": "60"
			}, {
				"full": "400",
				"cut": "80"
			}],
			payments: []
		},
		methods: {
			loadpayType: function() {
				var self = this;
				var params = E.systemParam("V5.mobile.paymentType.search");
				E.showLoading()
				E.getData('paymentTypeSearch', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.payments = data.payments;
				}, "get")
			},
			configInit: function() {
				this.fee = 0, this.sendType = "SINCE", this.couponName = "", this.coupon = 0, this.fullRoleName = "", this.addressObj = null
			},
			closeMask: function() {
				this.fullRoleshow = false
			},
			closeCardpay: function() {
				this.showCardpay = false
			},
			createOrder: function(c) {
				var self = this;
				var products = [];
				for(var i = 0; i < this.items.length; i++) {
					products.push({
						barcode: this.items[i].productItemId,
						stock: this.items[i].count
					})
				}
				var orderData = {
						postFee: this.fee,
						couponCode: this.couponCode,
						actualAmount: this.totalPrice,
						salesOrderAgioMoney: this.coupons,
						erpMemo: this.erpMemo,
						buyer: {
							consignee: this.addressObj ? this.addressObj.consignee : "",
							mobile: this.addressObj ? this.addressObj.mobilePhone : "",
							address: this.addressObj ? this.addressObj.address : ""
						},
						products: products,
						discount: this.memberDiscount
					}
					//				console.log(orderData)
					//				return
				var params = E.systemParam('V5.mobile.order.create');
				params = mui.extend(params, {
					orderData: JSON.stringify(orderData),
					uniqueCode: E.uniqueCode(),
					type: this.sendType,
				});

				E.showLoading()
				E.getData('orderCreate', params, function(data) {
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.closeLoading()
						E.alert(data.map.errorMsg)
						return
					}
					self.orderNumber = data.orderNumber;
					self.paySwitch(c)
				})
			},
			paySwitch: function(c) {
				mui('#payPopover').popover('hide');
				switch(c) {
					case "6":
						this.barcodePay(c)
						break;
					case "14":
					if(E.getStorage("vendor") == 0) {
							this.doPosCashier(c);
						} else {
							this.payMent(c)
						}
						break;
					case "15":
						this.barcodePay(c)
						break;
					case "17":
						this.mixPay()
						break;
					case "16":
						this.cardMethod()
						break;
					default:
						this.payMent(c)
						break;
				}
			},
			barcodePay: function(c) {
				E.openWindow("../barcode/payment.html", {
					orderNumber: this.orderNumber,
					pid: c,
					amount: this.totalPrice
				})
			},
			mixPay: function() {
				E.openWindow("mixPay.html", {
					orderNumber: this.orderNumber,
					totalPrice: this.totalPrice,
					memberCardNumber: this.memberMsg ? this.memberMsg.memberCardNumber : null
				})
			},
			cardMethod: function() {
				E.closeLoading()
				var self = this;
				if(this.memberMsg && this.memberMsg.memberCardNumber) {
					E.prompt('输入会员卡密码：', '输入会员卡密码', function(c) {
						if(!c) {
							E.toast("请输入");
							return
						}
						self.password = c;
						self.memberCardNumber = self.memberMsg.memberCardNumber;
						self.cardPay()
					})
				} else {
					this.showCardpay = true;
					setTimeout(function() {
						E.showLayer(0)
					}, 100)
				}

			},
			cardPay: function() {
				var self = this;
				if(!this.password || !this.memberCardNumber) {
					E.toast("信息不全");
					return
				}
				var params = E.systemParam("V5.mobile.order.alipay");
				params = mui.extend(params, {
					orderNumber: this.orderNumber,
					authCode: '',
					password: this.password,
					memberCardNumber: this.memberCardNumber,
					paymentType: 16
				})
				E.showLoading()
				E.getData('orderAlipay', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			payMent: function(c) {
				var self = this
				var params = E.systemParam("V5.mobile.order.alipay");
				params = mui.extend(params, {
					orderNumber: this.orderNumber,
					authCode: '',
					password: "",
					memberCardNumber: "",
					paymentType: parseInt(c)
				})
				E.showLoading()
				E.getData('orderAlipay', params, function(data) {
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			saveRoles: function() {
				var full, cut;
				mui(".supplierDiv").each(function() {
					if(this.querySelector("[type=radio]").checked) {
						full = this.querySelector("[type=radio]").getAttribute("full");
						cut = this.querySelector("[type=radio]").getAttribute("full");
					}
				})
				if(full) {
					if(parseFloat(this.mprice) < parseFloat(full)) {
						E.alert("该优惠码未满足优惠条件！");
						return
					}
					this.fullRoleName = "满" + full + "减" + cut;
					this.coupon = parseInt(this.coupon) + parseInt(cut);
					this.fullRoleshow = false
				}

			},
			loadFullRoles: function() {
				mui('#discountPopover').popover('hide');
				mui("#discountPopover")[0].removeAttribute("style")
				this.fullRoleshow = true;
				setTimeout(function() {
					E.showLayer(0)
				}, 0)

			},
			enterCoupon: function() {
				mui('#discountPopover').popover('hide');
				mui("#discountPopover")[0].removeAttribute("style")
				var self = this;
				E.prompt('输入优惠码：', '请输入优惠码', function(c) {
					if(!c) {
						E.alert("请输入优惠码");
						return
					}
					self.loadCoupon(c)
				})

			},
			scanCoupon: function() {
				mui('#discountPopover').popover('hide');
				mui("#discountPopover")[0].removeAttribute("style")
				var self = this;
				E.openWindow("../barcode/orderScan.html", {
					type: "coupon",
					mprice: self.totalPrice
				})

			},
			loadCoupon: function(c) {
				var self = this;
				var params = E.systemParam("V5.mobile.order.coupon.get");
				params = mui.extend(params, {
					couponCode: c
				})
				E.getData('couponGet', params, function(data) {
					console.log(data)
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					data = data.coupon
					var conditions = data.conditions;
					var beginning = data.beginning
					var termination = data.termination
					var nowing = new Date()
					beginning = new Date(beginning.replace(/-/g, "/"));
					termination = new Date(termination.replace(/-/g, "/"));
					self.denomination = 0;
					self.discount = 10;
					self.giveUrl = ''
					self.giveGoods = false
					self.couponCode = '';
					self.giveGoodsContent = []
					if(beginning > nowing || termination < nowing) {
						E.alert('优惠劵已失效！')
						return
					}
					switch(data.couponType) {
						case 1: //满减
							var denomination = data.denomination
							if(conditions != '' && conditions > 0 && conditions > self.totalPrice) {
								E.alert('订单金额没有达到赠送条件')
								return
							}
							if(self.storeJoinCount(data.channelCouponStores)) {
								//成功赠送
								//赠送金额为denomination
								self.denomination = denomination
							} else {
								E.alert('优惠劵在当前门店不可用')
								return
							}
							break;
						case 2: //折扣
							var discount = data.discount
							if(conditions != '' && conditions > 0 && conditions > self.totalPrice) {
								E.alert('订单金额没有达到赠送条件')
								return
							}
							if(self.storeJoinCount(data.channelCouponStores)) {
								//成功赠送
								//赠送折扣为discount
								self.discount = discount
							} else {
								E.alert('优惠劵在当前门店不可用')
								return
							}
							break;
						case 3: //赠品
							var productTypeId = data.productTypeId
							var storeTypeId = data.storeTypeId
							var premiumsSetting = data.premiumsSetting //是否倍增
							var promotionFreeSkus = data.promotionFreeSkus //赠品集合
							if(premiumsSetting == 1) {
								promotionFreeSkus.forEach(function(promotionFreeSku) {
									promotionFreeSku.freeCount = promotionFreeSku.freeCount * 2
								})
							}
							switch(data.useType) {
								case 1: //订单满指定金额
									if(conditions != '' && conditions > 0 && conditions > self.totalPrice) {
										E.alert('订单金额没有达到赠送条件')
										return
									}
									if((storeTypeId == '1' && self.storeJoinCount(data.channelCouponStores)) || (storeTypeId == '0' && !self.storeJoinCount(data.channelCouponStores))) {
										var JoinCount = productTypeId == '0' ? self.goodsunJoinCount(data.promotionProducts) : self.goodsJoinCount(data.promotionProducts)
										if(JoinCount > 0) {
											//成功赠送
											//赠品为promotionFreeSkus
											self.giveUrl = data.url
											self.giveGoods = true
											self.giveGoodsContent = promotionFreeSkus
										} else if(JoinCount == 0) {
											E.alert('订单无可使用优惠的商品')
											return
										} else {
											E.alert('没有商品达到赠送条件')
											return
										}
									} else {
										E.alert('优惠劵在当前门店不可用')
										return
									}
									break;
								case 2: //满商品总件数送
									var buyCount = data.buyCount //件数
									if((storeTypeId == '1' && self.storeJoinCount(data.channelCouponStores)) || (storeTypeId == '0' && !self.storeJoinCount(data.channelCouponStores))) {
										var JoinCount = productTypeId == '0' ? self.goodsunJoinCount(data.promotionProducts) : self.goodsJoinCount(data.promotionProducts)
										if(JoinCount >= buyCount) {
											//成功赠送
											//赠品为promotionFreeSkus
											self.giveUrl = data.url
											self.giveGoods = true
											self.giveGoodsContent = promotionFreeSkus
										} else if(JoinCount == 0) {
											E.alert('订单无可使用优惠的商品')
											return
										} else {
											E.alert('商品数量没达到使用要求')
											return
										}
									} else {
										E.alert('优惠劵在当前门店不可用')
										return
									}
									break;
								case 3: //买商品送
									if((storeTypeId == '1' && self.storeJoinCount(data.channelCouponStores)) || (storeTypeId == '0' && !self.storeJoinCount(data.channelCouponStores))) {
										var JoinCount = productTypeId == '0' ? self.goodsunJoinCount(data.promotionProducts) : self.goodsJoinCount(data.promotionProducts)
										if(JoinCount > 0) {
											//成功赠送
											//赠品为promotionFreeSkus
											self.giveGoods = true
											self.giveUrl = data.url
											self.giveGoodsContent = promotionFreeSkus
										} else {
											E.alert('订单无可使用优惠的商品')
											return
										}
									} else {
										E.alert('优惠劵在当前门店不可用')
										return
									}
									break;
								default:
									break;
							}
							break;
						default:
							break;
					}
					self.couponCode = c;
					//					var denomination = parseFloat(data.coupon.denomination);

					//					self.couponName = "满100减" + denomination;
					//					self.coupon = parseInt(denomination);
					//					self.coupons =self.coupon
				}, "get")
			},
			goodsJoinCount: function(products) {
				var count = 0
				for(var i in this.items) {
					for(var j in products) {
						if(this.items[i].productItemId == products[j].productItemId) {
							count += parseInt(this.items[i].count)
						}
					}
				}
				return count
			},
			goodsunJoinCount: function(products) {
				var count = 0
				for(var i in this.items) {
					var exit = 0
					for(var j in products) {
						if(this.items[i].productItemId == products[j].productItemId) {
							exit = 1
						}
					}
					if(exit == 0) {
						count += parseInt(this.items[i].count)
					}
				}
				return count
			},
			storeJoinCount: function(stores) {
				var status = false
				var self = this;
				for(var i in stores) {
					if(self.store == stores[i].name) {
						status = true
					}
				}
				return status
			},
			getAddress: function(c, d) {
				this.addressObj = JSON.parse(c);
				this.loadFee(d)
			},
			getMember: function(c) {
				console.log(c)
				this.memberMsg = JSON.parse(c);
				this.memberDiscount = parseFloat(this.memberMsg.memberDiscount) || 1
			},
			loadFee: function(a) {
				this.sendType = a;
				if(a == "STORE_DELIVER") {
					Page.getFee("STORE")
				} else {
					Page.getFee("ONLINE")
				}

			},
			goVipinfo: function() {
				E.openWindow('vipInfo.html')
			},
			registerCashierReceiver: function() {
				var self = this;
				var main = plus.android.runtimeMainActivity(); //获取activity
				//创建自定义广播实例
				var receiver = plus.android.implements(
					'io.dcloud.feature.internal.reflect.BroadcastReceiver', {
						onReceive: function(context, intent) { //实现onReceiver回调函数
							plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作
							var isSuccess = intent.getExtra("isSuccess");
							var msg = intent.getExtra("msg");
							if(isSuccess||'msg'=='支付成功') {
								self.payMent('14')
							} else {
								alert(msg);
							}

						}
					});

				var IntentFilter = plus.android
					.importClass('android.content.IntentFilter');
				var filter = new IntentFilter();

				filter.addAction("io.dcloud.pospay.cashiercallback"); //监听收银结果回调，自定义字符串

				main.registerReceiver(receiver, filter); //注册监听
			},
			doPosCashier: function(c) {
				this.cardType = c;
				var main_act = plus.android.runtimeMainActivity();
				var Intent = plus.android.importClass('android.content.Intent');
				var intent = new Intent();
				intent.setClassName(main_act, "io.dcloud.pospay.CashierService");

				var tradeNo = this.createTradeNoString();
				var seqNo = this.createSeqNoString();
				intent.putExtra("tradeNo", this.orderNumber); //商户订单号
				intent.putExtra("body", "这个是测试商品信息"); //订单描述
				intent.putExtra("attach", "这里是附加信息"); //附加数据,原样返回
				intent.putExtra("seqNo", seqNo); //订单序列号
				intent.putExtra("totalFee", (this.totalPrice * 100).toString()); //订单金额，单位为分
				//intent.putExtra("pay_type", "1001");//付款方式 收银apk暂时不支持，等待开放, 1001	现金,1003	微信支付,1004	支付宝,1005	百度钱包,1006	银行卡,1007	易付宝,1008	点评闪惠,1009	京东钱包

				main_act.startService(intent);

			},
			createTradeNoString: function() {
				var d = new Date();
				return d.getHours() + d.getMinutes() + d.getSeconds() +
					d.getMilliseconds() + "";
			},
			createSeqNoString: function() {
				var d = new Date();
				return d.getHours() + d.getMinutes() + d.getSeconds() +
					d.getMilliseconds() + "";
			},
			completePay: function(c) {
				var self = this;
				E.alert(c, function() {
					E.fireData(E.preloadPages[0], "detailShow", {
						orderNumber: Page.vue.orderNumber
					})
					plus.webview.hide("../cashr/cashrCart.html")
					plus.webview.hide("cashrDetail.html")
					setTimeout(function() {
						self.payments = [];
						self.memberMsg = null;
						E.closeWebview("../cashr/cashrCart.html")
						E.closeWebview("cashrDetail.html")
					}, 1000)
				})

			}
		},
		computed: {
			mprice: function() {
				var mprice = 0;
				for(var i = 0; i < this.items.length; i++) {
					mprice += (this.items[i].price) * (this.items[i].count)
				}
				return mprice
			},
			totalPrice: function() {

				var fees = this.fee ? parseFloat(this.fee) : 0
				var tprice = (parseFloat(this.mprice) + parseFloat(fees)).toFixed(2)
				var dprice = (this.memberDiscount * 1000 * tprice) / 1000 //会员优惠以后的总价格
				var dprice2 = dprice - (this.discount * 100 * dprice) / 1000 //优惠劵优惠的价格
				console.log(dprice)
				console.log(this.discount + ',' + dprice2)
				console.log((tprice - dprice) + parseFloat(this.denomination) + dprice2)
				console.log(tprice)
				this.coupons = ((tprice - dprice) + parseFloat(this.denomination) + dprice2) > tprice ? tprice : ((tprice - dprice) + parseFloat(this.denomination) + dprice2).toFixed(2);
				var price = (tprice - parseFloat(this.coupons)).toFixed(2);
				return price >= 0 ? price : 0
			}
		},

	}
}
Page.init()