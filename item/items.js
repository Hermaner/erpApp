var goodsList, uploadStock, pocket, searcBtn, searchtext, switchBtn, contentz, scanbox, ScanTxt;
var barcodeAr = [];
mui.init({
	pullRefresh: {
		container: '#tochange',
		up: {
			contentdown: '上拉加载更多',
			contentrefresh: '正在刷新中...',
			callback: pullupRefresh
		}
	},
	swipeBack: false,
	keyEventBind: {
		backbutton: false
	}

});
mui.plusReady(function() {
	if (plus.storage.getItem("imei") == 1) {
		document.getElementById("switchBtn").style.display = "none";
	} else {
		document.getElementById("switchBtn").style.display = "block";
	}
	goodsList = document.getElementById("goodsList");
	searchtext = document.getElementById("searchtext");
	searcBtn = document.getElementById("searcBtn");
	contentz = document.getElementsByClassName("mui-contentz")[0];
	searchbox = contentz.getElementsByClassName("switchBox")[0]
	scanbox = contentz.getElementsByClassName("switchBox")[1]
	switchBtn = document.getElementById("switchBtn");
	ScanTxt = document.getElementById("ScanTxt")
	clickedFn('.mui-bar-nav', 'span'); //打开扫描;  

	switchBtn.addEventListener("tap", function() {
		if (plus.os.name == "iOS") {
			plus.nativeUI.alert("该机型不支持扫描枪！", function() {}, "", "OK");
			return
		}
		var val = this.innerText;
		if (val == "开启扫描") {
			mui('#tochange').pullRefresh().endPullupToRefresh(true);
			document.getElementById("goodsList").innerHTML = "";
			searchbox.style.display = "none"
			scanbox.style.display = "block"
			ScanTxt.setAttribute("autofocus", "autofocus")
			this.innerText = "关闭扫描"
		} else {
			mui("#tochange").pullRefresh().refresh(true)
			searchbox.style.display = "block"
			scanbox.style.display = "none"
			this.innerText = "开启扫描";
			ItemId = null;
			canIndex = 1;
			mui("#tochange").pullRefresh().refresh(true)
			document.getElementById("goodsList").innerHTML = "";
			plus.nativeUI.showWaiting();
			getThisDate("");
		}
	})
	searcBtn.addEventListener("tap", function() { //本地搜索
		mui("#tochange").pullRefresh().refresh(true)
		var val = searchtext.value;
		ItemId = null
		canIndex = 1;
		//		document.getElementById("goodsList").innerHTML = "";
		plus.nativeUI.showWaiting();
		getThisDate(val);
		searchtext.value = "";
		if (plus.os.name == "Android") {
			window.scrollTo(0, 0)
		} else {
			mui('#tochange').pullRefresh().scrollTo(0, 0)
		}
	})

})

mui('#goodsList').on('tap', '.mui-table-view-cell', function() {
	var imgSrc = this.getElementsByClassName("itempic")[0].getAttribute("src");
	var name = this.getElementsByClassName("mui-flex-block")[0].innerText;
	var no = this.getElementsByClassName("mui-flex-block")[1].innerText;
	var type = this.getElementsByClassName("mui-flex-block")[2].innerText;
	var Iprice=this.getElementsByClassName("Iprice")[0].innerText;
	var Ibarcode=this.getElementsByClassName("Ibarcode")[0].innerText;
	var Istock=this.getElementsByClassName("Istock")[0].innerText;
	var IwarnStock=this.getElementsByClassName("IwarnStock")[0].innerText;
	mui.openWindow({
		url: "showItem.html",
		id: "showItem.html",
		extras: {
			imgSrc:imgSrc,
			name:name,
			no:no,
			type:type,
			Iprice:Iprice,
			Ibarcode:Ibarcode,
			Istock:Istock,
			IwarnStock:IwarnStock
		}
	})
});

function scanTxt(e) {
	var val = e.value;
	ItemId = null;
	canIndex = 1;
	document.getElementById("goodsList").innerHTML = "";
	plus.nativeUI.showWaiting();
	getThisDate(val);
	e.value = ""
}



var ItemId = null,
	canIndex = 1;

function getThisDate(val, c) {
	document.getElementById("switchBtn").innerText = "开启扫描";
	if (c) {
		ItemId = null;
		canIndex = 1
	}
	console.log(ItemId)
	var param = systemParam('V5.mobile.item.sku.search');
	param.optype = "up";
	param.condition = val || "";
	param.pageSize = 15;
	param.productItemId = ItemId || "";
	console.log(param);
	dataSendFn('itemSkuSearch', param, function(data) {
//		console.log(JSON.stringify(data));
		plus.nativeUI.closeWaiting();
		if (!data.isSuccess) {
			mui('#tochange').pullRefresh().endPullupToRefresh(true);
			var mapmsg = data.map.errorMsg;
//			document.getElementById("goodsList").innerHTML = "";
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			console.log(mapmsg)
			return
		}
		if (c) {
			document.getElementById("goodsList").innerHTML = "";
			if (plus.os.name == "Android") {
				window.scrollTo(0, 0)
			} else {
				mui('#tochange').pullRefresh().scrollTo(0, 0)
			}
		}
		if (ItemId == null) {
			document.getElementById("goodsList").innerHTML = "";
		}
		mui('#tochange').pullRefresh().endPullupToRefresh(false);
		var products = data.productSkus;
		ItemId = products[products.length - 1].productItemId
		for (var i = 0; i < products.length; i++) {
			var productItemId = products[i].productItemId;
			var productNumber = products[i].productNumber;
			var productName = products[i].productName;
			var productPic = products[i].productPic || "../images/cbd.jpg";
			var stock = products[i].stock;
			var skuName = products[i].skuName;
			var barcode = products[i].barcode;
			var price = products[i].price;
			var warnStock = products[i].warnStock || 0;
			var html = '<div class="mui-input-group" ><div class="mui-flex-all"><div class="mui-table-flex"><a class="mui-flex-all dd-top"><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width mui-flex-lineheight mui-text-right"><span class="mui-flex-block">NO：' + canIndex + '</span><span class="mui-flex-block">本店库存：' + stock + '</span><span class="mui-flex-block">预警库存：' + warnStock + '</span></div></a></div></div></div><div id="Icon" style="display:none"><div class="Iprice">'+price+'</div><div class="Ibarcode">'+barcode+'</div><div class="Istock">'+stock+'</div><div class="IwarnStock">'+warnStock+'</div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell mui-media item-liheight";
			li.setAttribute("barcode", barcode)
			li.innerHTML = html;
			goodsList.appendChild(li);
			canIndex++
		}
	}, "get")
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	getThisDate();
}

function openIntv() {
	document.getElementById("goodsList").innerHTML = "";
	var val = ScanTxt.value;
	if (!val.indexOf("*")) {
		valAr = []
		valAr.push(val)
	} else {
		valAr = val.split("*");
	}
	readData(0, valAr)
	ScanTxt.value = "";
}

function readData(i, valAr) {
	if ((i < valAr.length - 1) || valAr.length == 1) {
		scaned(valAr[i], i)

	}




}

function scaned(r, p) { //扫描返回数据
	//	r = r.substring(0, 4)
	var goodsList = document.getElementById("goodsList");
	var tolistli = goodsList.getElementsByTagName("li");
	var exist = 0;
	for (var i = 0; i < tolistli.length; i++) {
		var barcode = tolistli[i].getElementsByTagName("div")[0].getAttribute("barcode");
		if (r == barcode) {
			exist = 1;
			//			tolistli[i].getElementsByClassName("mui-numbox-input")[0].value=parseInt(tolistli[i].getElementsByClassName("mui-numbox-input")[0].value)+1;
			break
		}

	}
	if (exist == 1) {
		if (p || p == 0 && valAr.length != 1) {
			p += 1;
			readData(p, valAr)
		}
	} else {
		var param = systemParam("V5.mobile.item.get");
		param.barcode = r;
		dataSendFn('itemGet', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				console.log(mapmsg);
				return
			}
			barcodeAr.push(r)
			ImportData(data)
			if (p || p == 0 && valAr.length != 1) {
				p += 1;
				readData(p, valAr)
			}
		}, "get")
	}



}

function ImportData(data) { //导入数据
	var product = data.product;
	var productNumber = product.productNumber;
	var productName = product.productName;
	var productPic = product.productPic || "../images/cbd.jpg";;
	var skuNumber = product.skuNumber;
	var skuName = product.skuName;
	var price = parseFloat(product.price).toFixed(2);
	var barcode = product.barcode;
	var orderCount = product.orderCount || 1;
	if (!productNumber) {
		return
	}

	var html = '<div class="mui-input-group mui-slider-handle" barcode="' + barcode + '"><div class="mui-flex-all"><div class="mui-table-flex"><div class="mui-flex-all dd-top" ><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block" style="text-align: right;">价格：￥' + '<span class="pricei">' + price + '</span><div class="openCount" style="display:block">库存:' + orderCount + '</div></div></div></div></div></div>'
	var li = document.createElement("li");
	li.className = "mui-table-view-cell";
	li.setAttribute("barcode", barcode)
	li.innerHTML = html;
	goodsList.appendChild(li);
	numBtn(); //numer  点击自生成失效，需重新运行
}

function scanTxt(e) {
	var val = e.value;
	scaned(val)
	e.value = ""
}