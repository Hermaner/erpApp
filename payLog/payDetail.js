var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init();
		mui.plusReady(function() {
			window.addEventListener('detialShow', function(event) {
				self.vue.payId = event.detail.payId;
				if (self.vue.payId) {
					self.vue.loadData();
					self.vue.type="0"
				} else {
					self.vue.type="1"
					self.vue.showInput = true
					self.vue.showBody= true;
					self.vue.$set('store', E.getStorage("store"))
					self.vue.$set('op', E.getStorage("op"))
				}
			})
			self.ws = plus.webview.currentWebview();
		})
		var oldBack = mui.back;
		mui.back = function() {
			self.vue.clearData()
			self.vue.showBody=false;
			oldBack()
		}
		mui("#payPopover").on('tap', "li", function() {
			self.vue.paymentType = this.getAttribute("sid");
			self.vue.getConform()
			mui('#payPopover').popover('hide');
		})
	},
	vueObj: {
		el: '#vue',
		data: {
			type:"0",
			showInput: false,
			showCardpay: false,
			payId: "",
			password: "",
			showBody:false,
			memberCardNumber: "",
			orderNumber: "",
			paymentType: "",
			items: {
				payer: "",
				mobilephone: "",
				memo: "",
				amount: ""
			}

		},
		methods: {
			loadData: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.order.money.get');
				params.orderNumber = Page.vue.payId;
				E.showLoading()
				E.getData('orderMoneyGet', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.showBody= true
					self.items = data.orderMoneyGet;
				}, "get")
			},
			getConform: function(c) {
				var self = this;
				if (!this.items.payer || !this.items.mobilephone || !this.items.amount) {
					E.toast("信息不全")
					return
				}
				var telReg = !!(this.items.mobilephone).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if (telReg == false) {
					E.toast("请输入正确的手机号")
					this.items.mobilephone = ""
					return
				}
				var orderData = {
					payer: this.items.payer,
					amount: this.items.amount,
					mobilephone: this.items.mobilephone,
					memo: this.items.memo,
					paymentType: this.paymentType
				};
				var params = E.systemParam('V5.mobile.order.money.add');
				params.orderData = JSON.stringify(orderData);
				E.showLoading()
				E.getData('orderMoneyAdd', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.orderNumber = data.orderMoney
					self.paySwitch()
				}, "get")
			},
			getAway: function() {
				var self = this
				var params = E.systemParam('V5.mobile.order.money.hongchong');
				params.orderNumber = Page.vue.payId;
				E.showLoading()
				E.getData('orderMoneyHongChong', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.completePay("红冲成功")

				}, "get")
			},
			paySwitch: function() {
				switch (this.paymentType) {
					case "6":
						this.barcodePay()
						break;
					case "15":
						this.barcodePay()
						break;
					case "16":
						this.cardMethod()
						break;
					default:
						this.payMent()
						break;
				}
			},
			barcodePay: function() {
				E.openWindow("../barcode/payment.html", {
					orderNumber: this.orderNumber,
					pid: this.paymentType,
					type: "dingjinpay"
				})
			},
			cardMethod: function() {
				this.showCardpay = true;
				setTimeout(function() {
					E.showLayer(0)
				}, 0)

			},
			cardPay: function(c, d) {
				var self = this;
				if (!d && (!this.password || !this.memberCardNumber)) {
					E.toast("信息不全");
					return
				}
				var params = E.systemParam("V5.mobile.erp.pay");
				params = mui.extend(params, {
					number: this.orderNumber,
					authCode: '',
					password: this.password,
					memberCardNumber: this.memberCardNumber,
					paymentType: 16,
					type: "dingjinpay"

				})
				E.showLoading()
				E.getData('erpPay', params, function(data) {
					self.closeCardpay()
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			payMent: function() {
				var self = this
				var params = E.systemParam("V5.mobile.erp.pay");
				params = mui.extend(params, {
					number: this.orderNumber,
					authCode: '',
					memberCardNumber: "",
					password: "",
					paymentType: parseInt(this.paymentType),
					type: "dingjinpay"
				})
				E.showLoading()
				E.getData('erpPay', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			closeCardpay: function() {
				this.showCardpay = false
			},
			completePay: function(c) {
				E.calert(c, function() {
					Page.ws.opener().evalJS("Page.vue.loadData('',1)")
					mui.back()
				})
			},
			clearData: function() {
				this.showInput = false, this.showCardpay = false, this.password = "", this.memberCardNumber = "";
				this.items = {
					payer: "",
					mobilephone: "",
					memo: "",
					amount: ""
				}
			},
			printEvent: function() {
				E.showLoading()
				var pageDetail = plus.webview.getWebviewById("list/listdetail.html");
				var printAr = ["门店名称："+this.items.payStore, "门店定金凭证", "定金单号：" + this.items.orderNumber, "交易时间：" + this.items.created, "付款人：" + this.items.payer, "付款人手机：" + this.items.mobilephone, "今收到定金（人民币）：" + this.items.amount, "备注：" + this.items.memo, "顾客签名:", "此票为定金唯一凭证，请妥善保管，客服电话：4007285858"];
				printAr=printAr.join(",")
				pageDetail.evalJS("Page.vue.printData('" + printAr+",第一联：存根联',function(){Page.vue.printData('" + printAr + ",第二联：顾客联',1)})");


			}

		}
	}
}
Page.init()