var scanTxt, allpay, valAr, addcart2;
var barcodeAr = [];
mui.plusReady(function() {
	allpay = document.getElementById("allpay");
	addcart2 = document.getElementById("addcart2");
	if (document.getElementById("scanTxt")) {
		scanTxt = document.getElementById("scanTxt")
	}
	if (plus.storage.getItem("itemExist") == 1) {
//		OpenAllpay();
//		OpenTopay();
	}
})


function openIntv() {
	clearCheck();
	var val = scanTxt.value;
	if (!val.indexOf("*")) {
		valAr = []
		valAr.push(val)
	} else {
		valAr = val.split("*");
	}
	readData(0, valAr)
	scanTxt.value = "";
}

function readData(i, valAr) {
	if ((i < valAr.length - 1) || valAr.length == 1) {
		scaned(valAr[i], i)
	}
}

function scaned(r, p) { //扫描返回数据
	//	r = r.substring(0, 4)
	var tolistdetail = document.getElementById("tolistdetail");
	var tolistli = tolistdetail.getElementsByTagName("li");
	var exist = 0;
	for (var i = 0; i < tolistli.length; i++) {
		var barcode =tolistli[i].getElementsByTagName("div")[1].getAttribute("barcode");
		if (r == barcode) {
			exist = 1;
			tolistli[i].getElementsByClassName("mui-numbox-input")[0].value=parseInt(tolistli[i].getElementsByClassName("mui-numbox-input")[0].value)+1;
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
		param.type = "addOrder";
		dataSendFn('itemGet', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				console.log(mapmsg);
				return
			}
			barcodeAr.push(r)
			ImportData(data);
			OpenTopay();
			if (p || p == 0 && valAr.length != 1) {
				p += 1;
				readData(p, valAr)
			}
		}, "get")
	}



}
function scanCallback(e) {
	var tolistli = tolistdetail.getElementsByTagName("li");
	for (var i = 0; i < tolistli.length; i++) {
		var Tbarcode = tolistli[i].getElementsByTagName("div")[1].getAttribute("barcode");
		if (Tbarcode == e) {
			tolistli[i].getElementsByClassName("mui-numbox-input")[0].value=parseInt(tolistli[i].getElementsByClassName("mui-numbox-input")[0].value)+1;
			return
		}
	}
	var param = systemParam("V5.mobile.item.get");
	param.barcode = e;
	param.type = "addOrder";
	dataSendFn('itemGet', param, function(data) {
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			console.log(mapmsg);
			return
		}
		ImportData(data);
		OpenTopay();
	}, "get")
}
function ImportData(data) { //导入数据
	var product = data.product;
	var productNumber = product.productNumber;
	var productName = product.productName;
	var productPic = product.productPic || "../images/cbd.jpg";
	var skuNumber = product.skuNumber;
	var skuName = product.skuName;
	var price = parseFloat(product.price).toFixed(2);
	var barcode = product.barcode;
	var orderCount = product.orderCount || 1;
	if (!productNumber) {
		plus.ui.toast("没有此商品！", {
			duration: 200,
			verticalAlign: "top"
		})
		return
	}
	var html = '<div class="mui-slider-right mui-disabled"><a class="mui-btn swipe-btn mui-btn-red">删除</a></div><div class="mui-input-group mui-slider-handle" barcode="' + barcode + '"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth mui-flex-changeinput"><input name="checkbox"  class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all dd-top" ><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block" style="text-align: right;">价格：￥' + '<span class="pricei">' + price + '</span><div class="mui-numbox mui-flex-numbox openNum" data-numbox-min="1"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="1"><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div><div class="openCount" style="display:none">库存:'+orderCount+'</div></div></div></div></div></div>'
	var li = document.createElement("li");
	li.className = "mui-table-view-cell";
	li.setAttribute("barcode", barcode)
	li.innerHTML = html;
	tolistdetail.appendChild(li);

	numBtn(); //numer  点击自生成失效，需重新运行
}

function scanTxt(e) {
	var val = e.value;
	scaned(val)
	e.value = ""
}


function clearCheck(){
	var tolistdetail = document.getElementById("tolistdetail");
	var list2 = tolistdetail.getElementsByClassName("mui-table-view-cell");
	for (var i = 0; i < list2.length; i++) {
		var listCheck = list2[i].getElementsByTagName('input')[0];
		listCheck.checked=false;
	}
	document.getElementById("selectAll").checked = false;
	allCategory.innerHTML = 0;
	allNumber.innerHTML = 0;
}
function OpenTopay() {
	allpay.disabled = false;
	allpay.style.backgroundColor = "#FFFFFF";
	allpay.style.color = "#EC6C13";
	allpay.style.border = "1px solid #EC6C13";
}

function CloseTopay() {
	allpay.disabled = true;
	allpay.style.backgroundColor = "#CCCCCC";
	allpay.style.color = "#FFFFFF";
	allpay.style.border = "1px solid #CCCCCC";
}