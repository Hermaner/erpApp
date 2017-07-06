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

		})
		var old_back = mui.back;
		mui.back = function() {
			plus.webview.currentWebview().hide("pop-out")
			self.vue.configInit();
			self.vue.payments = [];
			self.vue.coupon = 0;
			self.vue.fee = 0;
			self.vue.showCardpay = false;
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
			if (sendId == "SINCE") {
				self.vue.fee = 0;
				self.vue.sendType = sendId;
				self.vue.addressObj = null
			} else if (sendId == "STORE_DELIVER") {
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
			if (!data.isSuccess) {
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
			if (!data.isSuccess) {
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
			coupons:0,
			oldcoupon: 0,
			couponCode: "",
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
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					var payments = data.payments;
					for (var i = 0; i < payments.length; i++) {
						if (payments[i].paymentType != "6" && payments[i].paymentType != "13" && payments[i].paymentType != "14" && payments[i].paymentType != "15" && payments[i].paymentType != "16" && payments[i].paymentType != "17") {
							self.payments.push(payments[i]);
						}
					}
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
				for (var i = 0; i < this.items.length; i++) {
					products.push({
						barcode: this.items[i].barcode,
						stock: this.items[i].count
					})
				}
				var orderData = {
					postFee: this.fee,
					couponCode: this.couponCode,
					buyer: {
						consignee: this.addressObj ? this.addressObj.consignee : "",
						mobile: this.addressObj ? this.addressObj.mobilePhone : "",
						address: this.addressObj ? this.addressObj.address : ""
					},
					products: products,
					discount: this.memberDiscount
				}

				var params = E.systemParam('V5.mobile.order.create');
				params = mui.extend(params, {
					orderData: JSON.stringify(orderData),
					uniqueCode: E.uniqueCode(),
					type: this.sendType,
				});
				E.showLoading()
				E.getData('orderCreate', params, function(data) {
					console.log(JSON.stringify(data))
					if (!data.isSuccess) {
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
				switch (c) {
					case "6":
						this.barcodePay(c)
						break;
					case "15":
						this.barcodePay(c)
						break;
					case "mixpay":
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
				if (this.memberMsg&&this.memberMsg.memberCardNumber) {
					E.prompt('输入会员卡密码：', '输入会员卡密码', function(c) {
						if (!c) {
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
				if (!this.password || !this.memberCardNumber) {
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
					if (!data.isSuccess) {
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
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			saveRoles: function() {
				var full, cut;
				mui(".supplierDiv").each(function() {
					if (this.querySelector("[type=radio]").checked) {
						full = this.querySelector("[type=radio]").getAttribute("full");
						cut = this.querySelector("[type=radio]").getAttribute("full");
					}
				})
				if (full) {
					if (parseFloat(this.mprice) < parseFloat(full)) {
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
					if (!c) {
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
					console.log(JSON.stringify(data))
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					var denomination = parseFloat(data.coupon.denomination);
					self.couponCode = c;
					self.couponName = "满100减" + denomination;
					self.coupon = parseInt(denomination);
					self.coupons =self.coupon
				}, "get")
			},
			getAddress: function(c, d) {
				this.addressObj = JSON.parse(c);
				this.loadFee(d)
			},
			getMember: function(c) {
				console.log(c)
				this.memberMsg = JSON.parse(c);
				this.memberDiscount = parseFloat(this.memberMsg.memberDiscount)||1
			},
			loadFee: function(a) {
				this.sendType = a;
				if (a == "STORE_DELIVER") {
					Page.getFee("STORE")
				} else {
					Page.getFee("ONLINE")
				}

			},
			goVipinfo: function() {
				E.openWindow('vipInfo.html')
			},
			completePay: function(c) {
				var self = this;
				E.alert(c, function() {
					E.fireData("list/listdetail.html", "detailShow", {
						orderNumber: Page.vue.orderNumber
					})
					setTimeout(function() {
						self.payments = [];
						self.memberMsg = null;
						E.closeWebview("cashr/cashrCart.html")
						E.closeWebview("cashrDetail.html")
					}, 1000)
				})

			}
		},
		computed: {
			mprice: function() {
				var mprice = 0;
				for (var i = 0; i < this.items.length; i++) {
					mprice += (this.items[i].price) * (this.items[i].count)
				}
				return mprice
			},
			totalPrice: function() {
				var fees=this.fee?parseFloat(this.fee):0
				var tprice=(parseFloat(this.mprice) + fees).toFixed(2)
				var dprice=(this.memberDiscount * tprice).toFixed(2);
				this.coupons=((tprice-dprice)+parseFloat(this.coupon))>tprice?tprice:((tprice-dprice)+parseFloat(this.coupon)).toFixed(2);
				var price = tprice - parseFloat(this.coupons)
				return price >= 0 ? price : 0
			}
		},

	}
}
Page.init()