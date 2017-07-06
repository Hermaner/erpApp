var scanTxt, preval, tt, valAr;
var barcodeAr = [];
mui.plusReady(function() {
	if (document.getElementById("scanTxt")) {
		scanTxt = document.getElementById("scanTxt")
			//		openIntv()
	}

})


function openIntv() {
	var val = scanTxt.value;
	if (!val) {
		plus.ui.toast("请输入查询信息", {
			duration: 200,
			verticalAlign: "top"
		})
		return
	}
	loadData(val)
//	if (!val.indexOf("*")) {
//		valAr = []
//		valAr.push(val)
//	} else {
//		valAr = val.split("*");
//	}
//	readData(0, valAr)
	scanTxt.value = "";
}

function loadData(val) {
	var params = E.systemParam('V5.mobile.cart.item.search');
	params = mui.extend(params, {
		condition: val,
		type: "infrared"
	})
	E.showLoading()
	E.getData('cartItemSearch', params, function(data) {
		E.closeLoading()
		console.log(JSON.stringify(data))
		if (!data.isSuccess) {
			E.alert(data.map.errorMsg)
			return
		}
		var products = data.productSkus;
		for (var i = 0; i < products.length; i++) {
			var product = products[i];
			var productNumber = product.productNumber;
			var productName = product.productName;
			var productPic = product.productPic || "../images/cbd.jpg";;
			var skuNumber = product.skuNumber;
			var skuName = product.skuName;
			var price = parseFloat(product.price).toFixed(2);
			var barcode = product.barcode;
			if (!productNumber) {
				plus.ui.toast("没有此商品！", {
					duration: 200,
					verticalAlign: "top"
				})
				return
			}

			var html = '<div class="mui-slider-right mui-disabled"><a class="mui-btn swipe-btn mui-btn-red">删除</a></div><div class="mui-input-group mui-slider-handle" barcode="' + barcode + '"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth mui-flex-changeinput"><input name="checkbox"  class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all dd-top" ><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><div class="mui-numbox mui-flex-numbox" data-numbox-min="0"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="1"><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div></div></div></div></div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.setAttribute("barcode", barcode)
			li.innerHTML = html;
			tolistdetail.appendChild(li);
			numBtn(); //numer  点击自生成失效，需重新运行
		}

	}, "get")
}

function closeIntv() {
	clearInterval(tt)
}

function readData(i, valAr) {
	if ((i < valAr.length - 1) || valAr.length == 1) {
		scaned(valAr[i], i)

	}




}

function scaned(r, p) { //扫描返回数据
	console.log(r)
		//	r = r.substring(0, 4)
	var tolistdetail = document.getElementById("tolistdetail");
	var tolistli = tolistdetail.getElementsByTagName("li");
	var exist = 0;
	for (var i = 0; i < tolistli.length; i++) {
		var barcode = tolistli[i].getElementsByTagName("div")[1].getAttribute("barcode");
		if (r == barcode) {
			exist = 1;
			tolistli[i].getElementsByClassName("mui-numbox-input")[0].value = parseInt(tolistli[i].getElementsByClassName("mui-numbox-input")[0].value) + 1;
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
		console.log(param.barcode)
		dataSendFn('itemGet', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				alert(mapmsg)
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
	if (!productNumber) {
		plus.ui.toast("没有此商品！", {
			duration: 200,
			verticalAlign: "top"
		})
		return
	}

	var html = '<div class="mui-slider-right mui-disabled"><a class="mui-btn swipe-btn mui-btn-red">删除</a></div><div class="mui-input-group mui-slider-handle" barcode="' + barcode + '"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth mui-flex-changeinput"><input name="checkbox"  class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all dd-top" ><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><div class="mui-numbox mui-flex-numbox" data-numbox-min="0"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="1"><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div></div></div></div></div></div>'
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