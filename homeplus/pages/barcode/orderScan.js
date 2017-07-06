var ws = null,
	wo = null;
var scan = null,
	domready = false,
	pageDetail, fiter, codeAr;
// H5 plus事件处理
function plusReady() {
	if(ws || !window.plus || !domready) {
		return;
	}
	// 获取窗口对象

	ws = plus.webview.currentWebview();
	wo = ws.opener();
	Page.openr = wo
	codeAr = [plus.barcode.EAN13, plus.barcode.EAN8, plus.barcode.AZTEC, plus.barcode.DATAMATRIX, plus.barcode.UPCA, plus.barcode.UPCE, plus.barcode.CODABAR, plus.barcode.CODE39, plus.barcode.CODE93, plus.barcode.CODE128, plus.barcode.ITF, plus.barcode.MAXICODE, plus.barcode.PDF417, plus.barcode.RSS14, plus.barcode.RSSEXPANDED]
		// 开始扫描
	ws.addEventListener('show', function() {
		if(ws.type == 'caserIn') {
			Page.vue.showTips = true
		}
		setBarcode()
		scan = new plus.barcode.Barcode('bcid', fiter);
		scan.onmarked = Page.onmarked;
		scan.start({
			conserve: true,
			filename: "_doc/barcode/"
		});
	});
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded", function() {
	domready = true;
	plusReady();
}, false);

function setBarcode() {
	var codeType = E.getStorage('codeType') || 9
	console.log(codeType)
	console.log(codeAr[codeType])
	fiter = [plus.barcode.QR, codeAr[codeType]]
}
var Page = {
	onmarked: function(type, result, file) {
		result = result.replace(/\n/g, '');
		console.log(result);
		switch(ws.type) {
			case "caserIn":
				Page.caserIn(result);
				break;
			case "item":
				Page.checkItem(result);
				break;
			case "itemAction":
				Page.checkItemAction(result)
				break;
			case "coupon":
				Page.checkCoupon(result)
				break;
			case "cart":
				Page.checkCart(result)
				break;
			case "since":
				result = JSON.parse(result);
				Page.sinceCode(result.code)
				break;
			default:
				if(result.length > 20) {
					result = JSON.parse(result);
					if(E.getStorage("isReturns") == '0' && result.type == '2') {
						alert('不能找到订单')
						return
					} else {
						Page.gotDetail(result.orderNumber, result.code || "")
					}
				} else {
					Page.gotDetail(result)
				}
				break;
		}
	},
	checkDetail: function(e) {
		var self = this;
		E.fireData(E.preloadPages[0], 'detailShow', {
			orderNumber: e,
			address: "",
			orderStatus: ""
		})
		setTimeout(function() {
			mui.back()
		}, 1000)

	},
	checkItem: function(c) {
		this.openr.evalJS("Page.vue.searchItem('" + c + "')")
		mui.back()
	},
	caserIn: function(c) {
		this.openr.evalJS("Page.vue.loadCoupon('" + c + "')")
		mui.back()
	},
	checkItemAction: function(c) {
		this.openr.evalJS("Page.vue.searchItem('" + c + "')")
		mui.back()
	},
	checkCoupon: function(c) {
		this.openr.evalJS("Page.vue.loadCoupon('" + c + "')")
		mui.back()
	},
	checkCart: function(c) {
		this.openr.evalJS("goodsActionPage.vue.searchItem('" + c + "',1)")
		mui.back()
	},
	sinceCode: function(c) {
		this.openr.evalJS("Page.vue.sinceScanCode('" + c + "')")
		mui.back()
	},
	gotDetail: function(c, d, j) {
		E.fireData(E.preloadPages[0], "detailShow", {
			orderNumber: c,
			code: d
		})
		setTimeout(function() {
			//			plus.webview.hide(ws, 'none', 0)
			plus.webview.close(ws, 'none', 0)
		}, 100)

	},
	handleWrite: function() {
		E.openPreWindow('enterCoupon')
		setTimeout(function() {
			plus.webview.close(ws, 'none', 0)
		}, 300)
	},
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {},
	vueObj: {
		el: '#vue',
		data: {
			showTips: false
		},
		methods: {

		}
	}

}
Page.init()