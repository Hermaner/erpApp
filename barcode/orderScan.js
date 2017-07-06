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
		// 开始扫描
	ws.addEventListener('show', function() {
		scan = new plus.barcode.Barcode('bcid');
		scan.onmarked = Page.onmarked;
		scan.start({
			conserve: true,
			filename: "_doc/barcode/"
		});
	});
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
			case "author":
				if (result.indexOf(",") > 0) {
					result=result.split(",")
					Page.gotDetail(result[0], result[1]||"")
				} else {
					Page.gotDetail(result)
				}
				break;
			default:
				Page.checkDetail(result)
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
		this.openr.evalJS("goodsPage.vue.searchItem('" + c + "')")
		mui.back()
	},
	checkItemAction: function(c) {
		this.openr.evalJS("goodsActionPage.vue.searchItem('" + c + "')")
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
	gotDetail: function(c, d, j) {
		E.fireData("list/listdetail.html", "detailShow", {
			orderNumber: c,
			code: d
		})
		setTimeout(function() {
			ws.hide();
			ws.close();
		}, 1500)

	}

}