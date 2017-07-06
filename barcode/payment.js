var ws = null,
	wo = null;
var scan = null,
	domready = false,
	pageDetail;
// H5 plus事件处理
function plusReady() {
	if (ws || !window.plus || !domready) {
		return;
	}
	// 获取窗口对象
	ws = plus.webview.currentWebview();
	wo = ws.opener();
	Page.openr = wo
	Page.ws = ws
		// 开始扫描
	ws.addEventListener('show', function() {
		scan = new plus.barcode.Barcode('bcid');
		scan.onmarked = Page.onmarked;
		scan.start({
			conserve: true,
			filename: "_doc/barcode/"
		});
	});
	E.closeLoading()
}
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded", function() {
	domready = true;
	plusReady();
}, false);


var Page = {
	plusEvent: function() {
		var oldBack = mui.back;
		mui.back = function() {
			if (ws.amount) {
				oldBack();
			} else {
				if ((Page.openr.getURL()).indexOf("cashrDetail.html") > 0) {
					mui.confirm("确定不支付返回门店列表？", '', ['是', '否'], function(e) {
						if (e.index == 0) {
							plus.webview.hide(Page.openr);
							oldBack();
						}
					})
				} else {
					oldBack();
				}
			}

		}
	},
	onmarked: function(type, result, file) {
		switch (type) {
			case plus.barcode.QR:
				type = "QR";
				break;
			case plus.barcode.EAN13:
				type = "EAN13";
				break;
			case plus.barcode.EAN8:
				type = "EAN8";
				break;
			case plus.barcode.CODE93:
				type = "CODE93";
				break;
			case plus.barcode.CODE128:
				type = "CODE128";
				break;
			case plus.barcode.CODE39:
				type = "CODE39";
				break;
			case plus.barcode.RSSEXPANDED:
				type = "RSSEXPANDED";
				break;
			case plus.barcode.RSS14:
				type = "RSS14";
				break;
			case plus.barcode.PDF417:
				type = "PDF417";
				break;
			case plus.barcode.MAXICODE:
				type = "MAXICODE";
				break;
			case plus.barcode.ITF:
				type = "ITF";
			case plus.barcode.CODABAR:
				type = "CODABAR";
			case plus.barcode.UPCE:
				type = "UPCE";
			case plus.barcode.UPCA:
				type = "UPCA";
			case plus.barcode.DATAMATRIX:
				type = "DATAMATRIX";
			case plus.barcode.AZTEC:
				type = "AZTEC";
				break;
			default:
				type = "其它";
				break;
		}
		result = result.replace(/\n/g, '');
		console.log(result);
		switch (ws.type) {
			case "mix":
				Page.mixPay(result)
				break;
			case "card":
				Page.rechargePay(result)
				break;
			case "dingjinpay":
				Page.payLog(result)
				break;
			case "detail":
				Page.detialPay(result)
				break;
			default:
				Page.payFunction(result)
				break;
		}
	},
	payFunction: function(c) {
		var params = E.systemParam("V5.mobile.order.alipay");
		params = mui.extend(params, {
			orderNumber: Page.ws.orderNumber,
			authCode: c,
			paymentType: Page.ws.pid,
			memberCardNumber: "",
			password: ""
		})
		E.showLoading()
		E.getData('orderAlipay', params, function(data) {
			E.closeLoading()
			if (!data.isSuccess) {
				E.alert(data.map.errorMsg)
				mui("#scanTips")[0].innerText = data.map.errorMsg
				setTimeout(function() {
					mui("#scanTips")[0].innerText = ""
				}, 3000)
				return
			}
			E.alert("支付成功", function() {
				E.fireData("list/listdetail.html", "detailShow", {
					orderNumber: Page.ws.orderNumber
				})
				setTimeout(function() {
					Page.openr.hide()
					E.getWebview("cashr/cashrCart.html").close()
					Page.ws.close();
				}, 100)
			})
		}, "get", "", 60000)

	},
	detialPay: function(c) {
		var params = E.systemParam("V5.mobile.order.alipay");
		params = mui.extend(params, {
			orderNumber: Page.ws.orderNumber,
			authCode: c,
			paymentType: parseInt(Page.ws.pid),
			memberCardNumber: "",
			password: ""
		})
		E.showLoading()
		E.getData('orderAlipay', params, function(data) {
			console.log(JSON.stringify(data))
			E.closeLoading()
			if (!data.isSuccess) {
				E.alert(data.map.errorMsg)
				mui("#scanTips")[0].innerText = data.map.errorMsg
				setTimeout(function() {
					mui("#scanTips")[0].innerText = ""
				}, 3000)
				return
			}

			E.alert("支付成功", function() {
				Page.ws.opener().evalJS("Page.vue.loadData('" + Page.ws.orderNumber + "')")
				mui.back()
			})
		}, "get", "", 60000)

	},
	rechargePay: function(c) {
		var params = E.systemParam("V5.mobile.erp.pay");
		params = mui.extend(params, {
			number: Page.ws.orderNumber,
			authCode: c,
			paymentType: parseInt(Page.ws.pid),
			memberCardNumber: "",
			password: "",
			type: "card"
		})
		E.showLoading()
		E.getData('erpPay', params, function(data) {
			console.log(JSON.stringify(data))
			E.closeLoading()
			if (!data.isSuccess) {
				mui("#scanTips")[0].innerText = data.map.errorMsg
				setTimeout(function() {
					mui("#scanTips")[0].innerText = ""
				}, 3000)
				return
			}
			E.alert("支付成功", function() {
				Page.openr.close()
				Page.ws.close()
			})
		}, "get", "", 60000)
	},
	payLog: function(c) {
		var params = E.systemParam("V5.mobile.erp.pay");
		params = mui.extend(params, {
			number: Page.ws.orderNumber,
			authCode: c,
			paymentType: parseInt(Page.ws.pid),
			memberCardNumber: "",
			password: "",
			type: "dingjinpay"
		})
		E.showLoading()
		E.getData('erpPay', params, function(data) {
			console.log(JSON.stringify(data))
			E.closeLoading()
			if (!data.isSuccess) {
				mui("#scanTips")[0].innerText = data.map.errorMsg
				setTimeout(function() {
					mui("#scanTips")[0].innerText = ""
				}, 3000)
				return
			}
			E.getWebview("payLog/payLog.html").evalJS("Page.vue.loadData('',1)")
			E.alert("支付成功", function() {
				mui.back()
				Page.openr.close()
			})

		}, "get", "", 60000)

	},
	mixPay: function(c) {
		var params = E.systemParam("V5.mobile.order.mixture.pay");
		params = mui.extend(params, {
			orderNumber: Page.ws.orderNumber,
			memberCardNumber: "",
			password: "",
			authCode: c,
			amount: Page.ws.amount,
			paymentType: parseInt(Page.ws.pid),
			type: "mixture"
		})
		E.showLoading()
		E.getData('orderMixturePay', params, function(data) {
			E.closeLoading()
			if (!data.isSuccess) {
				E.alert(data.map.errorMsg)
				return
			}
			Page.openr.evalJS("Page.vue.completePay('" + Page.ws.amount + "')")
			E.alert("支付成功", function() {
				mui.back()
			});
		}, null, "", 60000)
	}

}