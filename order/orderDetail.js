var Page = {
	outputStream: null,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig(), this.muiEvent()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			swipeBack: true,
			gestureConfig: {
				longtap: true

			}

		});
		mui.plusReady(function() {
			mui('.mui-scroll-wrapper').scroll();
			self.orderListPage = E.getWebview(E.subpages[2]);
			self.mapPage = E.getWebview(E.preloadPages[3]);
			E.getStorage("imei") == 1 && (self.vue.hasImei = true);
			window.addEventListener('detailShow', function(event) {
				self.vue.orderNumber = event.detail.orderNumber;
				self.vue.orderStatus = event.detail.orderStatus || "IN_STORE";
				Page.code = event.detail.code;
				self.vue.loadData(self.vue.orderNumber);
			})
			var oldBack = mui.back;
			mui.back = function() {
				self.vue.goodsDetail = false;
				self.vue.showBody = false;
				oldBack()
			}

		})
	},
	muiEvent: function() {
		var self = this
		mui("#payPopover").on('tap', "li", function() {
			self.vue.pid = this.getAttribute("pid");
			self.vue.paySwitch()
			mui('#payPopover').popover('hide');
		})
	},
	vueObj: {
		el: '#orderDetail',
		data: {
			items: [],
			orderNumber: "",
			orderStatus: "",
			statusDic: false,
			pid: "",
			sinceCode: "",
			waitCode: "",
			totalPrice: "",
			kickReasons: [],
			hasPay: "false",
			goodsDetail: false,
			showBody: true,
			payments: [],
			paymentName: null,
			mixturePays: null,
			mixTrue: false,
			showCardpay: false,
			memberCardNumber: "",
			password: "",
			isApplyForRefund: 0
		},
		methods: {
			loadData: function(e) {
				this.mixTrue = false
				var self = this;
				var params = E.systemParam("V5.mobile.order.info.get");
				params.orderNumber = e;
				self.statusDic = false;
				E.showLoading()
				console.log(e)
				E.getData('orderInfoGet', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading();
					if (!data.isSuccess) { 
						E.alert(data.map.errorMsg);
						return
					}
					self.items = data.order;
					self.totalPrice = self.items.totalAmount;
					self.isApplyForRefund = self.items.isApplyForRefund
					switch (self.items.orderStatus) {
						case "未接订单":
							self.orderStatus = "UN_ACCPET";
							break;
						case "自提订单":
							Page.sinceCode = data.order.sendCode
							self.orderStatus = "SINCE";
							if (Page.code) {
								self.sinceCode = Page.code
							}
							break;
						case "待收货订单":
							Page.waitCode = data.order.sendCode
							self.orderStatus = "WAIT_GOOD";
							if (Page.code) {
								self.waitCode = Page.code;
							}
							break;
						case "已接订单":
							self.orderStatus = "ACCPET";
							break;
							default:
							break
					}

					self.showBody = true;
					if (self.items.orderPayStatus == "未付款订单") {
						self.loadmixPays(self.orderNumber)
					}

				}, "get")
			},
			loadPaytype: function() {
				var self = this;
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
			loadmixPays: function(c) {
				var self = this;
				var params = E.systemParam("V5.mobile.order.mixture.pay.get");
				params.orderNumber = c;
				E.getData('orderMixturePayGet', params, function(data) {
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg);
						self.loadPaytype()
						console.log(data.map.errorMsg)
						return
					}
					self.mixturePays = data.mixturePays;
					console.log(JSON.stringify(self.mixturePays))
					if (self.mixturePays.length > 0) {
						self.mixTrue = true
					} else {
						self.loadPaytype()
					}
				}, "get")
			},
			sendGoods: function() {
				var self = this;
				E.showLoading()
				var params = E.systemParam("V5.mobile.order.outsend");
				params = mui.extend(params, {
					orderNumber: self.orderNumber,
					operation: 'STORE_DELIVERY'
				})
				E.getData('orderOutsend', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert("发货成功", function() {
						var page = plus.webview.getWebviewById("list/dingdan.html");
						page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
						mui.back();
					})
				}, "get")
			},
			getOrder: function() {
				var self = this;
				E.showLoading()
				var params = E.systemParam("V5.mobile.order.operation");
				params = mui.extend(params, {
					orderNumber: self.orderNumber,
					operation: 'ACCEPET',
					operationReason: ""
				})
				E.getData('orderOperation', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert("接单成功", function() {
						var page = plus.webview.getWebviewById("list/dingdan.html");
						page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
						mui.back();
					})
				}, "get")
			},
			sendCode: function(e) {
				var type, sec = 60;;
				e = mui(e)[0]
				e.setAttribute("disabled", "disabled");
				var params = E.systemParam("V5.mobile.order.code.send");
				var pid = e.getAttribute("pid");
				type = pid == "since" ? 'ZT' : 'FH'
				params.orderNumber = this.orderNumber;
				params.type = type;
				E.showLoading();
				E.getData('orderCodeSend', params, function(data) {
					E.closeLoading();
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					pid == "since" ? Page.sinceCode = data.code : Page.waitCode = data.code
					console.log(data.code);
					E.alert("发送成功");
					var t = setInterval(function() {
						if (sec <= 0) {
							e.innerHTML = "再次发送";
							e.removeAttribute("disabled");
							clearInterval(t)
							sec = 60
						} else {
							e.innerHTML = sec + "秒后可重新发送";
							sec--;
						}

					}, 1000)
				}, "get")
			},
			getwaitGoods: function(e) {
				var self = this
				if (!this.waitCode) {
					E.alert("请输入收货码");
					return
				}
				if (this.waitCode != Page.waitCode) {
					E.alert("请输入正确收货码")
					return
				}

				var params = E.systemParam("V5.mobile.order.comfirm");
				params = mui.extend(params, {
					orderNumber: self.orderNumber,
					operation: "STORE_DELIVERY",
					storeNo: self.waitCode
				})
				E.showLoading();
				E.getData('orderComfirm', params, function(data) {
					E.closeLoading();
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.waitCode = "", Page.waitCode = "";
					E.alert("收货成功", function() {
						var page = plus.webview.getWebviewById("list/dingdan.html");
						page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
						mui.back();
					})
				}, "get")
			},
			getsinceGoods: function(e) {
				var self = this
				if (!this.sinceCode) {
					E.alert("请输入提货码");
					return
				}
				if (this.sinceCode != Page.sinceCode) {
					E.alert("请输入正确提货码")
					return
				}
				var params = E.systemParam("V5.mobile.order.outsend");
				params = mui.extend(params, {
					orderNumber: self.orderNumber,
					operation: "SINCE",
					code: self.sinceCode
				})
				E.showLoading();
				E.getData('orderOutsend', params, function(data) {
					E.closeLoading();
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.sinceCode = "", Page.sinceCode = "";

					E.alert("自提成功", function() {
							var page = plus.webview.getWebviewById("list/dingdan.html");
							page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
							mui.back();
						})
						//					Page.orderListPage.evalJS("orderPage.vue.loadData('" + self.orderStatus + "','',1)")

				}, "get")
			},
			coorDinate: function() {
				var self = this;
				mui.prompt('申请协调：', '请输入申请协调原因', '', ['确定', '取消'], function(e) {
					if (e.index == 0) {
						if (!e.value) {
							E.alert("请输入申请协调原因")
							return
						}
						var params = E.systemParam("V5.mobile.order.operation");
						params = mui.extend(params, {
							orderNumber: self.orderNumber,
							operation: "APPLY",
							operationReason: e.value
						})
						E.showLoading();
						E.getData('orderOperation', params, function(data) {
							E.closeLoading();
							if (!data.isSuccess) {
								E.alert(data.map.errorMsg)
								return
							}
							E.alert("申请协调成功", function() {
								var page = plus.webview.getWebviewById("list/dingdan.html");
								page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
								mui.back();
							})
						}, "get")

					}
				})
			},
			getKick: function() {
				var self = this;
				var params = E.systemParam("V5.mobile.order.kickbackreason.search");
				E.showLoading()
				E.getData('orderKickbackreasonSearch', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.kickReasons = data.reasons
					setTimeout(function() {
						E.showLayer(0)
					}, 0)
				}, "get")
			},
			kickConfirm: function() {
				var self = this,
					vid;
				mui(".supplierDiv").each(function() {
					if (this.querySelector("[type=radio]").checked) {
						vid = this.querySelector("[type=radio]").getAttribute("vid");
					}
				})
				if (!vid) {
					return
				}
				var params = E.systemParam("V5.mobile.order.operation");
				params = mui.extend(params, {
					orderNumber: self.orderNumber,
					operation: "KICK_BACK",
					operationReason: vid
				})
				E.showLoading();
				E.getData('orderOperation', params, function(data) {
					E.closeLoading();
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert("成功踢回订单", function() {
						self.closeMask()
						var page = plus.webview.getWebviewById("list/dingdan.html");
						page.evalJS("getThisDate('" + self.orderStatus + "','',1)")
						mui.back();
					})
				}, "get")
			},
			closeMask: function() {
				this.kickReasons = []
			},
			printObj: function() {
				var printAr = ["店铺名称：" + this.items.shopName, "订单号：" + this.orderNumber, "收货人：" + this.items.logisticInfo.consignee, "收货人电话：" + this.items.logisticInfo.mobile || this.items.logisticInfo.phone, "收货地址：" + this.items.logisticInfo.address];
				for (i in this.items.products) {

					printAr.push(this.items.products[i].productName);
					printAr.push(("数量:" + this.items.products[i].count + "；单价:" + this.items.products[i].price));
					printAr.push(this.items.products[i].skuName);
				}
				printAr.push("共计" + this.items.productNum + "件；运费" + this.items.postFee + "元");
				printAr.push("应付" + this.items.totalAmount + "元");
				console.log(printAr)
				this.printData(printAr)
			},
			printData: function(printAr, c) {
				var self = this;
				var mac = plus.storage.getItem("mac");
//				var mac = "8C:DE:52:C5:D1:7C";
				E.closeLoading()
				if (plus.os.name == "iOS") {
					E.alert("苹果手机暂不支持");
					return
				}
				if (!mac) {
					E.alert("打印机尚未设置,点击更多进行设置");
					return
				}
				if (!Page.outputStream) {
					this.getbluetoothStatus()
					Page.outputStream = this.setPrint(mac)
				}
				if (typeof(printAr) == "string") {
					printAr = printAr.split(",")
				}
				for (var i = 0; i < printAr.length; i++) {
					var string = printAr[i];
					var bytes = plus.android.invoke(string, 'getBytes', 'gbk');
					Page.outputStream.write(bytes, 0, bytes.length);
					Page.outputStream.write(0X0D);
				}
				Page.outputStream.write(0X0D);
				Page.outputStream.write(0X0D);
				Page.outputStream.write(0X0A);
				Page.outputStream.flush();
				if (c) {
					c != 1 && c();
					return
				}
				E.showLoading();
				var params = E.systemParam("V5.mobile.order.print");
				params.orderNumber = self.orderNumber;
				E.getData('orderPrint', params, function(data) {
					E.closeLoading();
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}

				}, "get")
			},
			getbluetoothStatus: function() {
				var main = plus.android.runtimeMainActivity();
				var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
				var BAdapter = new BluetoothAdapter.getDefaultAdapter();
				var resultDiv = document.getElementById('output');
				var receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
					onReceive: function(context, intent) { //实现onReceiver回调函数
						plus.android.importClass(intent);
						console.log(intent.getAction());
						resultDiv.textContent += '\nAction :' + intent.getAction();
						main.unregisterReceiver(receiver);
					}
				});
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				var filter = new IntentFilter();
				filter.addAction(BAdapter.ACTION_STATE_CHANGED); //监听蓝牙开关
				main.registerReceiver(receiver, filter); //注册监听

				if (!BAdapter.isEnabled()) {
					E.toast("蓝牙开启中…");
					BAdapter.enable(); //启动蓝牙
				}
			},
			setPrint: function(c) {
				var main = plus.android.runtimeMainActivity();
				var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
				var UUID = plus.android.importClass("java.util.UUID");
				var uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
				var BAdapter = BluetoothAdapter.getDefaultAdapter();
				BAdapter.cancelDiscovery(); //停止扫描
				var device = BAdapter.getRemoteDevice(c);
				if (!device) {
					canprint = 0
					return
				}
				plus.android.importClass(device);
				var bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
				plus.android.importClass(bluetoothSocket);
				if (!bluetoothSocket.isConnected()) {
					bluetoothSocket.connect();
					var outputStream = bluetoothSocket.getOutputStream();
					plus.android.importClass(outputStream);
					return outputStream
				}
			},
			showGoods: function() {
				this.goodsDetail = true;
				//				this.showBody=false
				setTimeout(function() {
					mui("#goodsDetail")[0].style.overflow = "hidden";
					mui("#goodsDetail")[0].style.height = (plus.screen.resolutionHeight - 80) + "px";
				}, 0)

			},
			closeGoods: function() {
				this.goodsDetail = false;
				this.showBody = true
				setTimeout(function() {
					mui("#goodsDetail")[0].style.overflow = "auto";
					mui("#goodsDetail")[0].style.height = "auto";
				}, 0)

			},
			goToMap: function() {
				var self = this;
				var bournObj = {
					distance: self.items.distance + "km",
					orderNumber: self.orderNumber
				}
				E.fireData("map/maps_map.html", "detailMap", {
					bournObj: bournObj,
					Destination: self.items.logisticInfo.address,
					orderStatus: self.orderStatus
				})
			},
			paySwitch: function() {
				switch (this.pid) {
					case "6":
						this.barcodePay()
						break;
					case "15":
						this.barcodePay()
						break;
					case "mixpay":
						this.mixPay()
						break;
					case "16":
						this.cardMethod()
						break;
					default:
						this.payMent()
						break;
				}
			},
			barcodePay: function(c) {
				E.openWindow("../barcode/payment.html", {
					orderNumber: this.orderNumber,
					pid: this.pid,
					amount: this.totalPrice,
					type: "detail"
				})
			},
			mixPay: function() {
				E.openWindow("mixPay.html", {
					orderNumber: this.orderNumber,
					totalPrice: this.totalPrice,
					prePrice: this.items.initialTotalAmount
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
				var params = E.systemParam("V5.mobile.order.alipay");
				params = mui.extend(params, {
					orderNumber: this.orderNumber,
					authCode: '',
					password: this.password,
					memberCardNumber: this.memberCardNumber,
					paymentType: 16
				})
				E.showLoading()
				this.showCardpay = false;
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
				var self = this;
				var params = E.systemParam("V5.mobile.order.alipay");
				params = mui.extend(params, {
					orderNumber: this.orderNumber,
					authCode: '',
					password: "",
					memberCardNumber: "",
					paymentType: parseInt(this.pid)
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
			closeCardpay: function() {
				this.showCardpay = false;
			},
			changeOrder: function(c) {
				E.openWindow("changeGoods.html", {
					type: c,
					orderNumber: this.orderNumber,
					items: this.items.products,
				})
			},
			completePay: function(c) {
				var self = this;
				E.alert(c, function() {
					self.loadData(self.orderNumber)
				})

			},
			changePay: function() {
				console.log(this.payments)
				E.openWindow("changePayType.html", {
					initialTotalAmount: this.items.initialTotalAmount,
					orderNumber: this.orderNumber
				})
			}

		}
	}
}
Page.init()